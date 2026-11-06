import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Users } from "lucide-react";
import { playersQuery, settingsQuery } from "@/lib/queries";
import { seoMeta } from "@/lib/seo";
import { PLAYER_ROLES, playerMatchesRole } from "@/lib/content-rules";
import { EmptyState, PageHead } from "@/components/site/ui-x";
import { PlayerCard } from "@/components/site/Cards";

export const Route = createFileRoute("/players/")({
  loader: async ({ context: { queryClient } }) => {
    const [s] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery),
      queryClient.ensureQueryData(playersQuery),
    ]);
    return { seo: s.seo.players };
  },
  head: ({ loaderData }) => ({ meta: seoMeta(loaderData?.seo, "players") }),
  component: Players,
});

function Players() {
  const { data: players } = useSuspenseQuery(playersQuery);
  const [role, setRole] = useState("All");
  const list = players.filter((p) => playerMatchesRole(p, role));
  return (
    <>
      <PageHead
        crumb="Players"
        eyebrow="Team Roster"
        icon={Users}
        title="Our"
        accent="Players"
        sub="The INCINERATE ESPORTS Free Fire roster. Select a player to open their individual profile page."
      />
      <section className="section-x">
        <div className="container-x">
          <div className="filter-bar mb-8" role="group" aria-label="Filter by role">
            {["All", ...PLAYER_ROLES].map((r) => (
              <button
                key={r}
                type="button"
                className={`filter-btn ${role === r ? "is-active" : ""}`}
                aria-pressed={role === r}
                onClick={() => setRole(r)}
              >
                {r === "All" ? "All Roles" : r}
              </button>
            ))}
          </div>
          {list.length ? (
            <div className="grid-cards cols-4">
              {list.map((p) => (
                <PlayerCard key={p.id} player={p} showCountry />
              ))}
            </div>
          ) : (
            <EmptyState icon={Users}>No players found for this role yet.</EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
