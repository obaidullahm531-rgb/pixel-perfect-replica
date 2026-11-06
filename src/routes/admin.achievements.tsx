import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, Thumb } from "@/components/admin/ResourceManager";
import { formatDate } from "@/lib/content-rules";

export const Route = createFileRoute("/admin/achievements")({
  component: () => (
    <ResourceManager
      table="achievements"
      title="Achievements"
      singular="Achievement"
      folder="achievements"
      orderBy={[{ col: "achieved_on", asc: false }]}
      searchKeys={["tournament_name", "position"]}
      defaults={{ sort_order: 0 }}
      columns={[
        { label: "Banner", render: (r) => <Thumb src={r.banner_url} /> },
        { label: "Tournament", render: (r) => <span className="font-semibold">{String(r.tournament_name)}</span> },
        { label: "Position", render: (r) => String(r.position ?? "—") },
        { label: "Date", render: (r) => formatDate(r.achieved_on as string | null) || "—" },
        { label: "Prize", render: (r) => String(r.prize_money ?? "—") },
      ]}
      fields={[
        { name: "banner_url", label: "Tournament Banner", type: "image" },
        { name: "tournament_name", label: "Tournament Name", type: "text", required: true },
        { name: "position", label: "Position / Rank", type: "text", placeholder: "e.g. 1st Place" },
        { name: "prize_money", label: "Prize Money", type: "text" },
        { name: "achieved_on", label: "Date", type: "date" },
        { name: "team_members", label: "Team Members", type: "textarea", rows: 2 },
        { name: "details", label: "Result Details", type: "textarea" },
        { name: "sort_order", label: "Display Order", type: "number" },
      ]}
      beforeSave={(v) => ({ ...v, sort_order: v.sort_order ?? 0 })}
    />
  ),
});
