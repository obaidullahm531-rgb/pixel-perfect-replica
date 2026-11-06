import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Images, Play } from "lucide-react";
import { galleryQuery, settingsQuery, type GalleryItem } from "@/lib/queries";
import { seoMeta } from "@/lib/seo";
import { GALLERY_CATEGORIES, youtubeThumb } from "@/lib/content-rules";
import { EmptyState, PageHead } from "@/components/site/ui-x";
import { Lightbox } from "@/components/site/Overlay";

export const Route = createFileRoute("/gallery")({
  loader: async ({ context: { queryClient } }) => {
    const [s] = await Promise.all([queryClient.ensureQueryData(settingsQuery), queryClient.ensureQueryData(galleryQuery)]);
    return { seo: s.seo.gallery };
  },
  head: ({ loaderData }) => ({ meta: seoMeta(loaderData?.seo, "gallery") }),
  component: Gallery,
});

function Gallery() {
  const { data } = useSuspenseQuery(galleryQuery);
  const [cat, setCat] = useState("All");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const list = cat === "All" ? data : data.filter((g) => g.category === cat);
  return (
    <>
      <PageHead
        crumb="Gallery"
        eyebrow="Media"
        icon={Images}
        title="Our"
        accent="Gallery"
        sub="Team photos, tournaments, match highlights, victory celebrations and behind-the-scenes moments."
      />
      <section className="section-x">
        <div className="container-x">
          <div className="filter-bar mb-8" role="group" aria-label="Filter by category">
            {["All", ...GALLERY_CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-btn ${cat === c ? "is-active" : ""}`}
                aria-pressed={cat === c}
                onClick={() => setCat(c)}
              >
                {c}
              </button>
            ))}
          </div>
          {list.length ? (
            <div className="grid-cards cols-3">
              {list.map((g) => {
                const img = g.image_url || youtubeThumb(g.video_url);
                return (
                  <button
                    key={g.id}
                    type="button"
                    className="gallery-item"
                    onClick={() => setActive(g)}
                    aria-label={g.caption ? `Open ${g.caption}` : `Open ${g.category} image`}
                  >
                    {img ? (
                      <img src={img} alt={g.caption || `${g.category} — INCINERATE ESPORTS gallery`} loading="lazy" />
                    ) : (
                      <div className="aspect-[4/3]" />
                    )}
                    <span className="gallery-badge chip chip-fire">{g.category}</span>
                    {g.video_url ? (
                      <span className="gallery-play">
                        <span className="play-dot">
                          <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
                        </span>
                      </span>
                    ) : null}
                    {g.caption ? <span className="gallery-caption">{g.caption}</span> : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <EmptyState icon={Images}>No media in this category yet.</EmptyState>
          )}
        </div>
      </section>
      {active ? (
        <Lightbox
          item={{ imageUrl: active.image_url || youtubeThumb(active.video_url), videoUrl: active.video_url, caption: active.caption }}
          onClose={() => setActive(null)}
        />
      ) : null}
    </>
  );
}
