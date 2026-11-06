import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, Thumb } from "@/components/admin/ResourceManager";
import { youtubeThumb } from "@/lib/content-rules";

export const Route = createFileRoute("/admin/videos")({
  component: () => (
    <ResourceManager
      table="videos"
      title="Match Highlight Videos"
      singular="Video"
      folder="videos"
      orderBy={[{ col: "sort_order" }, { col: "created_at", asc: false }]}
      searchKeys={["title"]}
      defaults={{ category: "Match Highlights", sort_order: 0 }}
      columns={[
        { label: "Thumbnail", render: (r) => <Thumb src={r.thumbnail_url || youtubeThumb(r.video_url as string)} /> },
        { label: "Title", render: (r) => <span className="font-semibold">{String(r.title)}</span> },
        {
          label: "Source",
          render: (r) => (youtubeThumb(r.video_url as string) ? "YouTube" : "Uploaded file"),
        },
      ]}
      fields={[
        { name: "title", label: "Video Title", type: "text", required: true, full: true },
        { name: "video_url", label: "Video", type: "video", required: true, help: "Paste a YouTube link (via “Paste link”) or upload a video file." },
        { name: "thumbnail_url", label: "Thumbnail", type: "image", help: "Optional for YouTube videos — their thumbnail is used automatically." },
        { name: "category", label: "Label", type: "text" },
        { name: "sort_order", label: "Display Order", type: "number" },
      ]}
      beforeSave={(v) => ({ ...v, sort_order: v.sort_order ?? 0 })}
    />
  ),
});
