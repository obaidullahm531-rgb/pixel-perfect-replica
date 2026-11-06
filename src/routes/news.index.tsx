import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Newspaper } from "lucide-react";
import { newsQuery, settingsQuery } from "@/lib/queries";
import { seoMeta } from "@/lib/seo";
import { NEWS_CATEGORIES } from "@/lib/content-rules";
import { EmptyState, PageHead } from "@/components/site/ui-x";
import { NewsCard } from "@/components/site/Cards";

export const Route = createFileRoute("/news/")({
  loader: async ({ context: { queryClient } }) => {
    const [s] = await Promise.all([queryClient.ensureQueryData(settingsQuery), queryClient.ensureQueryData(newsQuery)]);
    return { seo: s.seo.news };
  },
  head: ({ loaderData }) => ({ meta: seoMeta(loaderData?.seo, "news") }),
  component: News,
});

function News() {
  const { data } = useSuspenseQuery(newsQuery);
  const [cat, setCat] = useState("All");
  const list = cat === "All" ? data : data.filter((n) => n.category === cat);
  return (
    <>
      <PageHead
        crumb="News"
        eyebrow="Newsroom"
        icon={Newspaper}
        title="News &"
        accent="Announcements"
        tone="blue"
        sub="Official announcements, roster updates, tournament news and results from INCINERATE ESPORTS."
      />
      <section className="section-x">
        <div className="container-x">
          <div className="filter-bar mb-8" role="group" aria-label="Filter by category">
            {["All", ...NEWS_CATEGORIES].map((c) => (
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
              {list.map((n) => (
                <NewsCard key={n.id} n={n} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Newspaper}>
              {data.length
                ? "No articles in this category yet."
                : "No articles have been published yet. Check back soon for announcements."}
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
