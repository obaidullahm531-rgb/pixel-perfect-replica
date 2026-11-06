import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CheckCircle2, Handshake } from "lucide-react";
import { settingsQuery, sponsorsQuery } from "@/lib/queries";
import { seoMeta } from "@/lib/seo";
import { EmptyState, PageHead } from "@/components/site/ui-x";
import { SponsorCard } from "@/components/site/Cards";
import { SponsorshipForm } from "@/components/site/Forms";

export const Route = createFileRoute("/sponsors")({
  loader: async ({ context: { queryClient } }) => {
    const [s] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery),
      queryClient.ensureQueryData(sponsorsQuery),
    ]);
    return { seo: s.seo.sponsors };
  },
  head: ({ loaderData }) => ({ meta: seoMeta(loaderData?.seo, "sponsors") }),
  component: Sponsors,
});

const BENEFITS = [
  "Brand placement on team jerseys and social channels.",
  "Visibility across tournament streams and match coverage.",
  "Access to an engaged, growing Free Fire community.",
  "Flexible packages tailored to marketing goals.",
];

function Sponsors() {
  const { data } = useSuspenseQuery(sponsorsQuery);
  return (
    <>
      <PageHead
        crumb="Sponsors"
        eyebrow="Partners"
        icon={Handshake}
        title="Sponsors &"
        accent="Partners"
        tone="blue"
        sub="Organizations supporting INCINERATE ESPORTS and the growth of Free Fire esports."
      />
      <section className="section-x">
        <div className="container-x">
          {data.length ? (
            <div className="grid-cards cols-3">
              {data.map((s) => (
                <SponsorCard key={s.id} sponsor={s} />
              ))}
            </div>
          ) : (
            <EmptyState icon={Handshake}>Our partners will be announced here soon.</EmptyState>
          )}
        </div>
      </section>
      <section className="section-x section-alt">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">
              <Handshake className="h-3.5 w-3.5" /> Partnership
            </span>
            <h2 className="section-title mt-2">
              Partner with <span className="fire-text">INCINERATE</span>
            </h2>
            <div className="divider-fire" />
            <p className="mt-5 text-muted-x">
              We are open to sponsorship and partnership from brands that want to reach the Free Fire esports community
              in Bangladesh.
            </p>
            <ul className="mt-6 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="detail-row">
                  <CheckCircle2 />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-x">
            <div className="card-pad">
              <h3 className="text-xl uppercase">Sponsorship Enquiry</h3>
              <p className="mb-3 text-sm text-muted-x">Tell us about your brand and goals.</p>
              <SponsorshipForm withType />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
