import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Mail, MailOpen, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAdminTable, type Row } from "@/components/admin/ResourceManager";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/admin/inbox")({
  component: InboxPage,
});

type Box = "contact_messages" | "sponsorship_enquiries" | "join_applications";

const BOXES: { key: Box; label: string; title: (r: Row) => string; fields: [string, string][] }[] = [
  {
    key: "contact_messages",
    label: "Contact Messages",
    title: (r) => `${r.full_name}${r.subject ? ` — ${r.subject}` : ""}`,
    fields: [
      ["Email", "email"],
      ["Subject", "subject"],
      ["Message", "message"],
    ],
  },
  {
    key: "sponsorship_enquiries",
    label: "Sponsorship Enquiries",
    title: (r) => `${r.company} — ${r.contact_person}`,
    fields: [
      ["Email", "email"],
      ["Phone", "phone"],
      ["Partnership type", "partnership_type"],
      ["Proposal", "details"],
    ],
  },
  {
    key: "join_applications",
    label: "Player Applications",
    title: (r) => `${r.ign} (${r.full_name}) — ${r.preferred_role}`,
    fields: [
      ["Email", "email"],
      ["Phone / WhatsApp", "phone"],
      ["Free Fire UID", "ff_uid"],
      ["Age", "age"],
      ["Country", "country"],
      ["Secondary role", "secondary_role"],
      ["Facebook", "facebook"],
      ["Gameplay video", "video_link"],
      ["Experience", "experience"],
    ],
  },
];

function InboxPage() {
  return (
    <div>
      <h1 className="text-2xl uppercase">Inbox</h1>
      <p className="text-sm text-muted-foreground">Submissions from the website forms.</p>
      <Tabs defaultValue="contact_messages" className="mt-5">
        <TabsList className="flex h-auto flex-wrap justify-start bg-surface">
          {BOXES.map((b) => (
            <TabsTrigger key={b.key} value={b.key}>
              {b.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {BOXES.map((b) => (
          <TabsContent key={b.key} value={b.key} className="mt-4">
            <BoxList box={b} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function BoxList({ box }: { box: (typeof BOXES)[number] }) {
  const qc = useQueryClient();
  const { data = [], isLoading, error } = useAdminTable(box.key);
  const [openId, setOpenId] = useState<string | null>(null);
  const [del, setDel] = useState<Row | null>(null);
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", box.key] });
    qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };

  const markRead = useMutation({
    mutationFn: async ({ id, read }: { id: string; read: boolean }) => {
      const { error } = await supabase.from(box.key).update({ is_read: read }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(box.key).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      setDel(null);
      refresh();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  if (isLoading) return <Loader2 className="mx-auto h-6 w-6 animate-spin text-primary" />;
  if (error) return <p className="alert-x alert-err">{error.message}</p>;
  if (!data.length) return <p className="admin-panel text-center text-muted-foreground">No submissions yet.</p>;

  return (
    <div className="flex flex-col gap-3">
      {data.map((r) => {
        const open = openId === r.id;
        return (
          <div key={r.id} className={`admin-panel ${r.is_read ? "" : "border-primary/60"}`}>
            <button
              type="button"
              className="flex w-full items-start justify-between gap-3 text-left"
              onClick={() => {
                setOpenId(open ? null : r.id);
                if (!r.is_read) markRead.mutate({ id: r.id, read: true });
              }}
            >
              <div className="min-w-0">
                <p className={`truncate ${r.is_read ? "" : "font-bold"}`}>{box.title(r)}</p>
                <p className="text-xs text-muted-foreground">{new Date(String(r.created_at)).toLocaleString()}</p>
              </div>
              {r.is_read ? <span className="chip chip-done">Read</span> : <span className="chip chip-fire">New</span>}
            </button>
            {open ? (
              <div className="mt-4 grid gap-3 border-t pt-4">
                {box.fields.map(([label, key]) =>
                  r[key] !== null && r[key] !== undefined && r[key] !== "" ? (
                    <div key={key}>
                      <p className="stat-label">{label}</p>
                      <p className="whitespace-pre-line break-words">
                        {key === "email" ? (
                          <a className="text-primary hover:underline" href={`mailto:${String(r[key])}`}>
                            {String(r[key])}
                          </a>
                        ) : (
                          String(r[key])
                        )}
                      </p>
                    </div>
                  ) : null,
                )}
                <div className="flex flex-wrap gap-2">
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => markRead.mutate({ id: r.id, read: !r.is_read })}>
                    {r.is_read ? <Mail /> : <MailOpen />} Mark as {r.is_read ? "unread" : "read"}
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDel(r)}>
                    <Trash2 /> Delete
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        );
      })}
      <AlertDialog open={del !== null} onOpenChange={(o) => !o && setDel(null)}>
        <AlertDialogContent className="border-border bg-popover">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this submission?</AlertDialogTitle>
            <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                if (del) remove.mutate(del.id);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
