import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Loader2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { ImageField } from "./ImageField";

type Key =
  | "published" | "sort_order" | "created_at" | "slug" | "title" | "name" | "label" | "url" | "platform"
  | "banner_url" | "tournament_name" | "position" | "achieved_on" | "prize_money" | "image_url" | "caption"
  | "category" | "video_url" | "thumbnail_url" | "full_name" | "subject" | "company" | "contact_person" | "ign"
  | "preferred_role" | "is_read" | "photo_url" | "age" | "real_name" | "role" | "role_label" | "featured"
  | "start_date" | "status" | "prize_pool" | "logo_url" | "tier" | "sponsor_type" | "published_at" | "email";

/** Known column names are typed explicitly so they can be read with dot access. */
export type Values = { [K in Key]?: unknown } & Record<string, unknown>;
export type Row = Values & { id: string };

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "date" | "select" | "checkbox" | "image" | "video" | "url" | "email";
  required?: boolean;
  options?: readonly string[] | { value: string; label: string }[];
  placeholder?: string;
  help?: string;
  full?: boolean;
  rows?: number;
};

export type ColumnDef = { label: string; render: (row: Row) => ReactNode };

// Loose client view so one manager can serve every content table.
type LooseQuery = {
  select: (cols: string) => LooseQuery;
  order: (col: string, opts?: { ascending?: boolean }) => LooseQuery;
  insert: (v: Record<string, unknown>) => LooseQuery;
  update: (v: Record<string, unknown>) => LooseQuery;
  delete: () => LooseQuery;
  eq: (col: string, v: unknown) => LooseQuery;
  then: <T>(cb: (r: { data: unknown; error: { message: string } | null }) => T) => Promise<T>;
};
const db = supabase as unknown as { from: (t: string) => LooseQuery };

export function useAdminTable(table: string, orderBy: { col: string; asc?: boolean }[] = [{ col: "created_at", asc: false }]) {
  return useQuery({
    queryKey: ["admin", table],
    queryFn: async () => {
      let q = db.from(table).select("*");
      for (const o of orderBy) q = q.order(o.col, { ascending: o.asc ?? true });
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return (data ?? []) as Row[];
    },
  });
}

function toFormValue(field: FieldDef, v: unknown): string | boolean {
  if (field.type === "checkbox") return Boolean(v);
  if (v === null || v === undefined) return "";
  if (field.type === "date" && typeof v === "string") return v.slice(0, 10);
  return String(v);
}

function fromFormValue(field: FieldDef, v: string | boolean): unknown {
  if (field.type === "checkbox") return Boolean(v);
  const s = String(v).trim();
  if (field.type === "number") return s === "" ? null : Number(s);
  return s === "" ? null : s;
}

export function ResourceManager({
  table,
  title,
  singular,
  fields,
  columns,
  defaults = {},
  orderBy,
  folder,
  searchKeys = [],
  beforeSave,
  hasPublished = true,
}: {
  table: string;
  title: string;
  singular: string;
  fields: FieldDef[];
  columns: ColumnDef[];
  defaults?: Record<string, unknown>;
  orderBy?: { col: string; asc?: boolean }[];
  folder: string;
  searchKeys?: string[];
  beforeSave?: (values: Values, existing: Row | null) => Values | string;
  hasPublished?: boolean;
}) {
  const qc = useQueryClient();
  const { data: rows = [], isLoading, error } = useAdminTable(table, orderBy);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return rows;
    const needle = q.toLowerCase();
    return rows.filter((r) => searchKeys.some((k) => String(r[k] ?? "").toLowerCase().includes(needle)));
  }, [rows, q, searchKeys]);

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", table] });
    qc.invalidateQueries({ queryKey: ["public"] });
  };

  const save = useMutation({
    mutationFn: async ({ values, existing }: { values: Record<string, unknown>; existing: Row | null }) => {
      const res = existing
        ? await db.from(table).update(values).eq("id", existing.id)
        : await db.from(table).insert(values);
      if (res.error) throw new Error(res.error.message);
    },
    onSuccess: (_d, v) => {
      toast.success(v.existing ? `${singular} updated` : `${singular} added`);
      setEditing(null);
      setCreating(false);
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  const remove = useMutation({
    mutationFn: async (row: Row) => {
      const res = await db.from(table).delete().eq("id", row.id);
      if (res.error) throw new Error(res.error.message);
    },
    onSuccess: () => {
      toast.success(`${singular} deleted`);
      setToDelete(null);
      invalidate();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed"),
  });

  const togglePublished = useMutation({
    mutationFn: async (row: Row) => {
      const res = await db.from(table).update({ published: !row.published }).eq("id", row.id);
      if (res.error) throw new Error(res.error.message);
    },
    onSuccess: invalidate,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Update failed"),
  });

  const formOpen = creating || editing !== null;

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl uppercase">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {rows.length} {rows.length === 1 ? "item" : "items"} · changes appear on the website immediately
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {searchKeys.length ? (
            <label className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                className="form-input !py-2 !pl-9"
                placeholder="Search…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
          ) : null}
          <button type="button" className="btn btn-primary btn-sm" onClick={() => setCreating(true)}>
            <Plus /> Add {singular}
          </button>
        </div>
      </div>

      <div className="admin-panel overflow-x-auto !p-0">
        {isLoading ? (
          <div className="grid place-items-center p-10">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <p className="alert-x alert-err m-4">{error.message}</p>
        ) : filtered.length === 0 ? (
          <p className="p-10 text-center text-muted-foreground">Nothing here yet. Click “Add {singular}” to create one.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.label}>{c.label}</th>
                ))}
                {hasPublished ? <th>Visible</th> : null}
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  {columns.map((c) => (
                    <td key={c.label}>{c.render(r)}</td>
                  ))}
                  {hasPublished ? (
                    <td>
                      <Switch
                        checked={Boolean(r.published)}
                        onCheckedChange={() => togglePublished.mutate(r)}
                        aria-label={r.published ? "Hide from website" : "Show on website"}
                      />
                    </td>
                  ) : null}
                  <td>
                    <div className="flex justify-end gap-1.5">
                      <button type="button" className="icon-btn" aria-label="Edit" onClick={() => setEditing(r)}>
                        <Pencil />
                      </button>
                      <button type="button" className="icon-btn danger" aria-label="Delete" onClick={() => setToDelete(r)}>
                        <Trash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog
        open={formOpen}
        onOpenChange={(o) => {
          if (!o) {
            setEditing(null);
            setCreating(false);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto border-border bg-popover">
          <DialogHeader>
            <DialogTitle className="uppercase">{editing ? `Edit ${singular}` : `Add ${singular}`}</DialogTitle>
            <DialogDescription>Fields marked * are required.</DialogDescription>
          </DialogHeader>
          {formOpen ? (
            <RecordForm
              key={editing?.id ?? "new"}
              fields={fields}
              initial={editing ?? { ...defaults }}
              folder={folder}
              saving={save.isPending}
              onCancel={() => {
                setEditing(null);
                setCreating(false);
              }}
              onSubmit={(values) => {
                const out = beforeSave ? beforeSave(values, editing) : values;
                if (typeof out === "string") {
                  toast.error(out);
                  return;
                }
                save.mutate({ values: out, existing: editing });
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog open={toDelete !== null} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent className="border-border bg-popover">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this {singular.toLowerCase()}?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes it from the website. This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={(e) => {
                e.preventDefault();
                if (toDelete) remove.mutate(toDelete);
              }}
            >
              {remove.isPending ? <Loader2 className="animate-spin" /> : null} Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RecordForm({
  fields,
  initial,
  folder,
  saving,
  onSubmit,
  onCancel,
}: {
  fields: FieldDef[];
  initial: Record<string, unknown>;
  folder: string;
  saving: boolean;
  onSubmit: (values: Values) => void;
  onCancel: () => void;
}) {
  const [vals, setVals] = useState<Record<string, string | boolean>>(() =>
    Object.fromEntries(fields.map((f) => [f.name, toFormValue(f, initial[f.name])])),
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, v: string | boolean) => {
    setVals((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    for (const f of fields) {
      const v = vals[f.name];
      if (f.required && f.type !== "checkbox" && !String(v ?? "").trim()) errs[f.name] = `${f.label} is required`;
      if (f.type === "url" && v && !/^https?:\/\//.test(String(v).trim())) errs[f.name] = "Must start with http:// or https://";
      if (f.type === "number" && v !== "" && Number.isNaN(Number(v))) errs[f.name] = "Must be a number";
    }
    setErrors(errs);
    if (Object.values(errs).some(Boolean)) return;
    onSubmit(Object.fromEntries(fields.map((f) => [f.name, fromFormValue(f, vals[f.name] ?? "")])));
  };

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      {fields.map((f) => {
        const v = vals[f.name];
        const err = errors[f.name];
        const wrap = (child: ReactNode) => (
          <div key={f.name} className={f.full || f.type === "textarea" || f.type === "image" || f.type === "video" ? "sm:col-span-2" : ""}>
            {child}
            {f.help ? <p className="mt-1 text-xs text-muted-foreground">{f.help}</p> : null}
            {err ? <p className="field-error">{err}</p> : null}
          </div>
        );
        if (f.type === "image" || f.type === "video")
          return wrap(
            <ImageField
              label={`${f.label}${f.required ? " *" : ""}`}
              value={String(v ?? "")}
              onChange={(url) => set(f.name, url)}
              folder={folder}
              accept={f.type === "video" ? "video/*,image/*" : "image/*"}
            />,
          );
        if (f.type === "checkbox")
          return wrap(
            <label className="flex items-center gap-3 pt-6">
              <Switch checked={Boolean(v)} onCheckedChange={(c) => set(f.name, c)} />
              <span>{f.label}</span>
            </label>,
          );
        const common = {
          id: `f-${f.name}`,
          className: `form-input ${err ? "has-error" : ""}`,
          value: String(v ?? ""),
          placeholder: f.placeholder,
          onChange: (e: { target: { value: string } }) => set(f.name, e.target.value),
        };
        return wrap(
          <>
            <label htmlFor={common.id} className="form-label">
              {f.label} {f.required ? "*" : null}
            </label>
            {f.type === "textarea" ? (
              <textarea {...common} rows={f.rows ?? 4} />
            ) : f.type === "select" ? (
              <select {...common}>
                <option value="">— Select —</option>
                {(f.options ?? []).map((o) =>
                  typeof o === "string" ? (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ) : (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ),
                )}
              </select>
            ) : (
              <input
                {...common}
                type={f.type === "number" ? "number" : f.type === "date" ? "date" : f.type === "email" ? "email" : "text"}
              />
            )}
          </>,
        );
      })}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <button type="button" className="btn btn-ghost btn-sm" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
          {saving ? <Loader2 className="animate-spin" /> : null} Save
        </button>
      </div>
    </form>
  );
}

export function Thumb({ src }: { src: unknown }) {
  return typeof src === "string" && src ? (
    <img src={src} alt="" className="thumb-sm" />
  ) : (
    <div className="thumb-sm grid place-items-center text-muted-foreground">—</div>
  );
}

export function PublishedBadge({ on }: { on: boolean }) {
  return on ? (
    <span className="chip chip-live">
      <Eye /> Live
    </span>
  ) : (
    <span className="chip chip-done">
      <EyeOff /> Hidden
    </span>
  );
}
