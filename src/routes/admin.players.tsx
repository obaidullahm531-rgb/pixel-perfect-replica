import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, Thumb } from "@/components/admin/ResourceManager";
import { PLAYER_ROLES, slugify } from "@/lib/content-rules";

export const Route = createFileRoute("/admin/players")({
  component: () => (
    <ResourceManager
      table="players"
      title="Players"
      singular="Player"
      folder="players"
      orderBy={[{ col: "sort_order" }, { col: "created_at" }]}
      searchKeys={["ign", "real_name", "role"]}
      defaults={{ country: "Bangladesh", role: "Support", featured: false, sort_order: 0 }}
      columns={[
        { label: "Photo", render: (r) => <Thumb src={r.photo_url} /> },
        { label: "In-game name", render: (r) => <span className="font-semibold">{String(r.ign)}</span> },
        { label: "Real name", render: (r) => String(r.real_name ?? "—") },
        { label: "Role", render: (r) => String(r.role_label || r.role) },
        { label: "Featured", render: (r) => (r.featured ? <span className="chip chip-fire">Home</span> : "—") },
      ]}
      fields={[
        { name: "photo_url", label: "Player Photo", type: "image" },
        { name: "ign", label: "In-Game Name", type: "text", required: true, placeholder: "INC-NAME" },
        { name: "real_name", label: "Real Name", type: "text" },
        { name: "role", label: "Main Role", type: "select", options: PLAYER_ROLES, required: true },
        { name: "role_label", label: "Role Label (shown on card)", type: "text", placeholder: "e.g. Sniper + IGL", help: "Optional. Leave empty to show the main role." },
        { name: "age", label: "Age", type: "number" },
        { name: "country", label: "Country", type: "text" },
        { name: "address", label: "Address", type: "text" },
        { name: "ff_uid", label: "Free Fire UID", type: "text" },
        { name: "bio", label: "Biography", type: "textarea" },
        { name: "experience", label: "Experience", type: "textarea", rows: 3 },
        { name: "facebook", label: "Facebook", type: "url" },
        { name: "youtube", label: "YouTube", type: "url" },
        { name: "instagram", label: "Instagram", type: "url" },
        { name: "tiktok", label: "TikTok", type: "url" },
        { name: "discord", label: "Discord", type: "url" },
        { name: "other_links", label: "Other Social Links", type: "textarea", rows: 2, help: "Paste links separated by spaces or new lines." },
        { name: "slug", label: "Profile URL name", type: "text", help: "Optional. Generated from the in-game name if empty." },
        { name: "sort_order", label: "Display Order", type: "number", help: "Lower numbers show first." },
        { name: "featured", label: "Feature on homepage", type: "checkbox" },
      ]}
      beforeSave={(v) => {
        const slug = slugify(String(v.slug || v.ign || ""));
        if (!slug) return "Please enter an in-game name.";
        return { ...v, slug, sort_order: v.sort_order ?? 0 };
      }}
    />
  ),
});
