import { createFileRoute } from "@tanstack/react-router";
import { ResourceManager, Thumb } from "@/components/admin/ResourceManager";
import { NEWS_CATEGORIES, formatDate, slugify } from "@/lib/content-rules";

export const Route = createFileRoute("/admin/news")({
  component: () => (
    <ResourceManager
      table="news"
      title="News Articles"
      singular="Article"
      folder="news"
      orderBy={[{ col: "published_at", asc: false }]}
      searchKeys={["title", "category"]}
      defaults={{ category: "Official Announcements", published_at: new Date().toISOString().slice(0, 10) }}
      columns={[
        { label: "Image", render: (r) => <Thumb src={r.image_url} /> },
        { label: "Title", render: (r) => <span className="font-semibold">{String(r.title)}</span> },
        { label: "Category", render: (r) => String(r.category) },
        { label: "Date", render: (r) => formatDate(r.published_at as string) },
      ]}
      fields={[
        { name: "image_url", label: "Featured Image", type: "image" },
        { name: "title", label: "Article Title", type: "text", required: true, full: true },
        { name: "category", label: "Category", type: "select", options: NEWS_CATEGORIES, required: true },
        { name: "published_at", label: "Publication Date", type: "date", required: true },
        { name: "excerpt", label: "Short Description", type: "textarea", rows: 2 },
        { name: "content", label: "Full Article", type: "textarea", rows: 10, help: "Leave a blank line between paragraphs." },
        { name: "slug", label: "Article URL name", type: "text", help: "Optional. Generated from the title if empty." },
      ]}
      beforeSave={(v) => {
        const slug = slugify(String(v.slug || v.title || ""));
        if (!slug) return "Please enter a title.";
        return { ...v, slug };
      }}
    />
  ),
});
