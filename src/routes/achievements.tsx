import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Medal } from "lucide-react";
import { achievementsQuery, settingsQuery } from "@/lib/queries";
import { seoMeta } from "@/lib/seo";
import { EmptyState, PageHead } from "@/components/site/ui-x";
import { AchievementCard } from "@/components/site/Cards";

export const Route = createFileRoute("/achievements")({
  loader: async ({ context: { queryClient } }) => {
    const [s] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery),
      queryClient.ensureQueryData(achievementsQuery),
    ]);
    return { seo: s.seo.achievements };
  },
  head: ({ loaderData }) => ({ meta: seoMeta(loaderData?.seo, "achievements") }),
  component: Achievements,
});

function Achievements() {
  const { data } = useSuspenseQuery(achievementsQuery);
  return (
    <>
      <PageHead
        crumb="Achievements"
        eyebrow="Results"
        icon={Medal}
        title="Achievements &"
        accent="Results"
        sub="Tournament positions, prize results and standout performances from INCINERATE ESPORTS."
      />
      <section className="section-x">
        <div className="container-x">
          {data.length ? (
            <div className="grid-cards cols-3">
              {data.map((a) => (
                <AchievementCard key={a.id} a={a} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Medal}>Achievements will appear here as tournaments are completed.</EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
