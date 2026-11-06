import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Info, UserPlus } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { seoMeta } from "@/lib/seo";
import { PageHead } from "@/components/site/ui-x";
import { JoinForm } from "@/components/site/Forms";

export const Route = createFileRoute("/join")({
  loader: async ({ context: { queryClient } }) => {
    const s = await queryClient.ensureQueryData(settingsQuery);
    return { seo: s.seo.join };
  },
  head: ({ loaderData }) => ({ meta: seoMeta(loaderData?.seo, "join") }),
  component: Join,
});

const CHECKLIST = [
  "An active Garena Free Fire account with competitive experience.",
  "Availability for scheduled practice sessions and scrims.",
  "A working headset and clear communication in English or Bengali.",
  "A short gameplay clip or highlight reel we can review.",
];

function Join() {
  return (
    <>
      <PageHead
        crumb="Join Our Team"
        eyebrow="Recruitment"
        icon={UserPlus}
        title="Join Our"
        accent="Team"
        sub="Recruitment for the INCINERATE ESPORTS Garena Free Fire roster is open. Submit your application and our management team will review it."
      />
      <section className="section-x">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          <div className="flex flex-col gap-5">
            <div className="card-x">
              <div className="card-pad gap-4">
                <h2 className="text-xl uppercase">Application Checklist</h2>
                <ul className="space-y-3">
                  {CHECKLIST.map((c) => (
                    <li key={c} className="detail-row">
                      <CheckCircle2 />
                      <span className="text-muted-x">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card-x">
              <div className="card-pad">
                <h3 className="flex items-center gap-2 text-lg uppercase">
                  <Info className="h-5 w-5 text-primary" /> What happens next
                </h3>
                <p className="text-muted-x">
                  Applications are reviewed by our management team. Shortlisted players are contacted for a trial
                  scrim. We only publish player information with permission.
                </p>
              </div>
            </div>
          </div>
          <div className="card-x">
            <div className="card-pad">
              <h2 className="text-xl uppercase">Player Application</h2>
              <p className="mb-3 text-sm text-muted-x">Fields marked * are required.</p>
              <JoinForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
