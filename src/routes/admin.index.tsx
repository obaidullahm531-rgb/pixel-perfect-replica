import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Award, Clapperboard, Handshake, Images, Inbox, Newspaper, Trophy, User, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

const TILES = [
  { table: "players", label: "Players", icon: Users, to: "/admin/players" },
  { table: "managers", label: "Managers", icon: User, to: "/admin/managers" },
  { table: "tournaments", label: "Tournaments", icon: Trophy, to: "/admin/tournaments" },
  { table: "achievements", label: "Achievements", icon: Award, to: "/admin/achievements" },
  { table: "sponsors", label: "Sponsors", icon: Handshake, to: "/admin/sponsors" },
  { table: "news", label: "News Articles", icon: Newspaper, to: "/admin/news" },
  { table: "gallery", label: "Gallery Items", icon: Images, to: "/admin/gallery" },
  { table: "videos", label: "Videos", icon: Clapperboard, to: "/admin/videos" },
] as const;

const INBOX = ["contact_messages", "sponsorship_enquiries", "join_applications"] as const;

function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: async () => {
      const counts = await Promise.all(
        TILES.map(async (t) => {
          const { count } = await supabase.from(t.table).select("id", { count: "exact", head: true });
          return [t.table, count ?? 0] as const;
        }),
      );
      const unread = await Promise.all(
        INBOX.map(async (t) => {
          const { count } = await supabase.from(t).select("id", { count: "exact", head: true }).eq("is_read", false);
          return [t, count ?? 0] as const;
        }),
      );
      return { counts: Object.fromEntries(counts), unread: Object.fromEntries(unread) };
    },
  });
  const totalUnread = data ? Object.values(data.unread).reduce((a, b) => a + b, 0) : 0;

  return (
    <div>
      <h1 className="text-2xl uppercase">Dashboard</h1>
      <p className="text-sm text-muted-foreground">Everything you change here updates the public website right away.</p>

      <Link to="/admin/inbox" className="admin-panel mt-6 flex items-center justify-between gap-4 transition hover:border-primary">
        <div className="flex items-center gap-3">
          <Inbox className="h-6 w-6 text-primary" />
          <div>
            <p className="font-heading text-sm uppercase tracking-widest">Inbox</p>
            <p className="text-muted-foreground">
              {isLoading
                ? "Loading…"
                : `${data?.unread.contact_messages ?? 0} messages · ${data?.unread.sponsorship_enquiries ?? 0} enquiries · ${data?.unread.join_applications ?? 0} applications unread`}
            </p>
          </div>
        </div>
        {totalUnread ? <span className="chip chip-fire">{totalUnread} new</span> : <span className="chip chip-done">All read</span>}
      </Link>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TILES.map((t) => (
          <Link key={t.table} to={t.to} className="admin-panel transition hover:-translate-y-1 hover:border-primary">
            <t.icon className="h-6 w-6 text-primary" />
            <p className="mt-3 font-heading text-3xl">{isLoading ? "–" : (data?.counts[t.table] ?? 0)}</p>
            <p className="stat-label mt-1">{t.label}</p>
          </Link>
        ))}
      </div>

      <div className="admin-panel mt-6">
        <h2 className="text-lg uppercase">Quick tips</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
          <li>Use the “Visible” switch on any list to hide an item from the website without deleting it.</li>
          <li>Featured players appear on the homepage; all visible players appear on the Players page.</li>
          <li>Videos accept YouTube links or uploaded video files.</li>
          <li>Logo, hero image, homepage text, footer and page titles live in Site Settings.</li>
        </ul>
      </div>
    </div>
  );
}
