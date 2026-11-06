import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager } from "@/components/admin/ResourceManager";
import { SOCIAL_PLATFORMS } from "@/lib/content-rules";
import { SocialIcon, platformLabel } from "@/components/site/BrandIcons";

export const Route = createFileRoute("/admin/social")({
  component: () => (
    <ResourceManager
      table="social_links"
      title="Social Media Links"
      singular="Social Link"
      folder="social"
      orderBy={[{ col: "sort_order" }]}
      defaults={{ platform: "facebook", sort_order: 0 }}
      columns={[
        {
          label: "Platform",
          render: (r) => (
            <span className="flex items-center gap-2">
              <SocialIcon platform={String(r.platform)} className="h-4 w-4 text-primary" />
              {String(r.label || platformLabel(String(r.platform)))}
            </span>
          ),
        },
        { label: "Link", render: (r) => <span className="break-all text-muted-foreground">{String(r.url)}</span> },
      ]}
      fields={[
        {
          name: "platform",
          label: "Platform",
          type: "select",
          required: true,
          options: SOCIAL_PLATFORMS.map((p) => ({ value: p, label: platformLabel(p) })),
        },
        { name: "url", label: "Link", type: "url", required: true },
        { name: "label", label: "Custom label", type: "text", help: "Optional." },
        { name: "sort_order", label: "Display Order", type: "number" },
      ]}
      beforeSave={(v) => ({ ...v, sort_order: v.sort_order ?? 0 })}
    />
  ),
});
