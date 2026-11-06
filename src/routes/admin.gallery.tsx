import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, Thumb } from "@/components/admin/ResourceManager";
import { GALLERY_CATEGORIES } from "@/lib/content-rules";

export const Route = createFileRoute("/admin/gallery")({
  component: () => (
    <ResourceManager
      table="gallery"
      title="Gallery"
      singular="Gallery Item"
      folder="gallery"
      orderBy={[{ col: "sort_order" }, { col: "created_at", asc: false }]}
      searchKeys={["caption", "category"]}
      defaults={{ category: "Team Photos", sort_order: 0 }}
      columns={[
        { label: "Image", render: (r) => <Thumb src={r.image_url} /> },
        { label: "Caption", render: (r) => String(r.caption ?? "—") },
        { label: "Category", render: (r) => String(r.category) },
        { label: "Video", render: (r) => (r.video_url ? "Yes" : "—") },
      ]}
      fields={[
        { name: "image_url", label: "Image", type: "image" },
        { name: "caption", label: "Caption", type: "text" },
        { name: "category", label: "Category", type: "select", options: GALLERY_CATEGORIES, required: true },
        { name: "video_url", label: "Video (optional)", type: "video", help: "Upload a video file or paste a YouTube link." },
        { name: "sort_order", label: "Display Order", type: "number" },
      ]}
      beforeSave={(v) => {
        if (!v.image_url && !v.video_url) return "Please add an image or a video.";
        return { ...v, sort_order: v.sort_order ?? 0 };
      }}
    />
  ),
});
