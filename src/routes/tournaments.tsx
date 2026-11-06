import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Trophy } from "lucide-react";
import { settingsQuery, tournamentsQuery } from "@/lib/queries";
import { seoMeta } from "@/lib/seo";
import { TOURNAMENT_STATUSES, statusLabel } from "@/lib/content-rules";
import { EmptyState, PageHead } from "@/components/site/ui-x";
import { TournamentCard } from "@/components/site/Cards";

export const Route = createFileRoute("/tournaments")({
  loader: async ({ context: { queryClient } }) => {
    const [s] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery),
      queryClient.ensureQueryData(tournamentsQuery),
    ]);
    return { seo: s.seo.tournaments };
  },
  head: ({ loaderData }) => ({ meta: seoMeta(loaderData?.seo, "tournaments") }),
  component: Tournaments,
});

function Tournaments() {
  const { data } = useSuspenseQuery(tournamentsQuery);
  const [filter, setFilter] = useState("all");
  const list = filter === "all" ? data : data.filter((t) => t.status === filter);
  return (
    <>
      <PageHead
        crumb="Tournaments"
        eyebrow="Competition"
        icon={Trophy}
        title="Our"
        accent="Tournaments"
        tone="blue"
        sub="Upcoming, ongoing and completed Garena Free Fire tournaments featuring INCINERATE ESPORTS."
      />
      <section className="section-x">
        <div className="container-x">
          <div className="filter-bar mb-8" role="group" aria-label="Filter by status">
            {["all", ...TOURNAMENT_STATUSES].map((f) => (
              <button
                key={f}
                type="button"
                className={`filter-btn ${filter === f ? "is-active" : ""}`}
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
              >
                {f === "all" ? "All" : statusLabel(f)}
              </button>
            ))}
          </div>
          {list.length ? (
            <div className="grid-cards cols-3">
              {list.map((t) => (
                <TournamentCard key={t.id} t={t} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Trophy}>
              {data.length
                ? "No tournaments in this category right now."
                : "No tournaments have been published yet. Follow our social channels for announcements."}
            </EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
