import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, Thumb } from "@/components/admin/ResourceManager";

export const Route = createFileRoute("/admin/managers")({
  component: () => (
    <ResourceManager
      table="managers"
      title="Team Managers"
      singular="Manager"
      folder="managers"
      orderBy={[{ col: "sort_order" }, { col: "created_at" }]}
      searchKeys={["name", "position"]}
      defaults={{ position: "Team Manager", sort_order: 0 }}
      columns={[
        { label: "Photo", render: (r) => <Thumb src={r.photo_url} /> },
        { label: "Name", render: (r) => <span className="font-semibold">{String(r.name)}</span> },
        { label: "Position", render: (r) => String(r.position) },
        { label: "Age", render: (r) => (r.age ? String(r.age) : "—") },
      ]}
      fields={[
        { name: "photo_url", label: "Photo", type: "image" },
        { name: "name", label: "Name", type: "text", required: true },
        { name: "position", label: "Position", type: "text", required: true },
        { name: "age", label: "Age", type: "number" },
        { name: "email", label: "Email", type: "email" },
        { name: "phone", label: "Phone", type: "text" },
        { name: "instagram", label: "Instagram", type: "url" },
        { name: "facebook", label: "Facebook", type: "url" },
        { name: "bio", label: "Description", type: "textarea" },
        { name: "sort_order", label: "Display Order", type: "number" },
      ]}
      beforeSave={(v) => ({ ...v, sort_order: v.sort_order ?? 0 })}
    />
  ),
});
