import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, Thumb } from "@/components/admin/ResourceManager";
import { TOURNAMENT_STATUSES, formatDate, statusLabel } from "@/lib/content-rules";

export const Route = createFileRoute("/admin/tournaments")({
  component: () => (
    <ResourceManager
      table="tournaments"
      title="Tournaments"
      singular="Tournament"
      folder="tournaments"
      orderBy={[{ col: "start_date", asc: false }]}
      searchKeys={["name", "organizer"]}
      defaults={{ status: "upcoming", sort_order: 0 }}
      columns={[
        { label: "Banner", render: (r) => <Thumb src={r.banner_url} /> },
        { label: "Name", render: (r) => <span className="font-semibold">{String(r.name)}</span> },
        { label: "Status", render: (r) => statusLabel(String(r.status)) },
        { label: "Date", render: (r) => formatDate(r.start_date as string | null) || "—" },
        { label: "Prize", render: (r) => String(r.prize_pool ?? "—") },
      ]}
      fields={[
        { name: "banner_url", label: "Tournament Banner", type: "image" },
        { name: "name", label: "Tournament Name", type: "text", required: true },
        { name: "organizer", label: "Organizer", type: "text" },
        {
          name: "status",
          label: "Status",
          type: "select",
          required: true,
          options: TOURNAMENT_STATUSES.map((s) => ({ value: s, label: statusLabel(s) })),
        },
        { name: "start_date", label: "Start Date", type: "date" },
        { name: "start_time", label: "Start Time", type: "text", placeholder: "e.g. 8:00 PM BST" },
        { name: "prize_pool", label: "Prize Pool", type: "text", placeholder: "e.g. ৳50,000" },
        { name: "stream_url", label: "Live Stream Link", type: "url" },
        { name: "description", label: "Description", type: "textarea" },
        { name: "schedule", label: "Match Schedule", type: "textarea", rows: 3 },
        { name: "result", label: "Result", type: "textarea", rows: 2 },
        { name: "sort_order", label: "Display Order", type: "number" },
      ]}
      beforeSave={(v) => ({ ...v, sort_order: v.sort_order ?? 0 })}
    />
  ),
});
