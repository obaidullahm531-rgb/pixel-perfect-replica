import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, Thumb } from "@/components/admin/ResourceManager";
import { PARTNERSHIP_TYPES } from "@/lib/content-rules";

export const Route = createFileRoute("/admin/sponsors")({
  component: () => (
    <ResourceManager
      table="sponsors"
      title="Sponsors"
      singular="Sponsor"
      folder="sponsors"
      orderBy={[{ col: "sort_order" }, { col: "created_at" }]}
      searchKeys={["name", "tier"]}
      defaults={{ sponsor_type: "corporate", tier: "Title Sponsor", sort_order: 0 }}
      columns={[
        { label: "Logo", render: (r) => <Thumb src={r.logo_url} /> },
        { label: "Name", render: (r) => <span className="font-semibold">{String(r.name)}</span> },
        { label: "Position", render: (r) => String(r.tier ?? "—") },
        { label: "Type", render: (r) => (r.sponsor_type === "individual" ? "Individual" : "Corporate") },
      ]}
      fields={[
        { name: "logo_url", label: "Logo / Photo", type: "image" },
        { name: "name", label: "Sponsor Name", type: "text", required: true },
        { name: "tier", label: "Position", type: "select", options: PARTNERSHIP_TYPES },
        {
          name: "sponsor_type",
          label: "Sponsor Type",
          type: "select",
          required: true,
          options: [
            { value: "corporate", label: "Corporate (logo)" },
            { value: "individual", label: "Individual supporter (photo)" },
          ],
        },
        { name: "website", label: "Website", type: "url" },
        { name: "description", label: "Details", type: "textarea" },
        { name: "sort_order", label: "Display Order", type: "number" },
      ]}
      beforeSave={(v) => ({ ...v, sort_order: v.sort_order ?? 0 })}
    />
  ),
});
