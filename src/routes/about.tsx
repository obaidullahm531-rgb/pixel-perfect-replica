import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Compass,
  Eye,
  Gamepad2,
  ListChecks,
  MapPin,
  Medal,
  Megaphone,
  Route as RouteIcon,
  Shield,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { seoMeta } from "@/lib/seo";
import { PageHead, SectionHead } from "@/components/site/ui-x";

export const Route = createFileRoute("/about")({
  loader: async ({ context: { queryClient } }) => {
    const s = await queryClient.ensureQueryData(settingsQuery);
    return { seo: s.seo.about };
  },
  head: ({ loaderData }) => ({ meta: seoMeta(loaderData?.seo, "about") }),
  component: About,
});

const TIMELINE = [
  { t: "Foundation", d: "A squad of Free Fire players commits to structured practice, defined roles and shared goals." },
  { t: "Preparation", d: "Daily scrims, map review and strategy sessions build the chemistry a competitive roster needs." },
  { t: "Competition", d: "The roster enters Garena Free Fire tournaments and tests its discipline against real opposition." },
  { t: "The Comeback", d: "Every loss is reviewed, every weakness is trained out. We return stronger, round after round." },
  { t: "The Future", d: "Expanding the roster, growing the community and building partnerships that sustain the organisation." },
];

function About() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  const snapshot = [
    { icon: Gamepad2, label: "Primary Title", value: s.game },
    { icon: MapPin, label: "Based In", value: s.country },
    { icon: Users, label: "Roster", value: "Competitive Free Fire Squad" },
    { icon: Megaphone, label: "Recruitment", value: "Open — Apply Anytime" },
  ];
  return (
    <>
      <PageHead
        crumb="About Us"
        eyebrow="About Us"
        icon={Shield}
        title="The"
        accent="INCINERATE"
        after="Story"
        sub="Who we are, what we stand for, and where we are taking Free Fire esports in Bangladesh."
      />

      <section className="section-x">
        <div className="container-x grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div>
            <h2 className="section-title">Built from the ground up</h2>
            <div className="divider-fire" />
            <div className="mt-5 space-y-3 text-muted-x">
              {s.aboutStory.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/players" className="btn btn-primary">
                <Users /> Meet the Roster
              </Link>
              <Link to="/join" className="btn btn-ghost">
                <Zap /> Join the Team
              </Link>
            </div>
          </div>
          <aside className="card-x self-start">
            <div className="card-pad gap-5">
              <h3 className="text-xl uppercase">Team Snapshot</h3>
              {snapshot.map((it) => (
                <div key={it.label} className="detail-row">
                  <it.icon />
                  <div>
                    <p className="stat-label">{it.label}</p>
                    <p className="stat-value !mt-0.5">{it.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-x section-alt">
        <div className="container-x">
          <SectionHead
            eyebrow="Direction"
            icon={Compass}
            title="Mission, Vision &"
            accent="Goals"
            tone="blue"
            sub="What drives INCINERATE ESPORTS forward, on and off the battlefield."
          />
          <div className="grid-cards cols-3">
            {[
              { icon: Target, t: "Our Mission", d: s.mission },
              { icon: Eye, t: "Our Vision", d: s.vision },
              { icon: ListChecks, t: "Our Goals", d: s.goals },
            ].map((c) => (
              <div key={c.t} className="card-x hoverable">
                <div className="card-pad">
                  <c.icon className="feature-icon" />
                  <h3 className="card-title mt-1">{c.t}</h3>
                  <p className="text-muted-x">{c.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-x">
        <div className="container-x grid gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">
              <RouteIcon className="h-3.5 w-3.5" /> The Journey
            </span>
            <h2 className="section-title mt-2">
              Our Competitive <span className="fire-text">Path</span>
            </h2>
            <div className="divider-fire" />
            <p className="mt-5 text-muted-x">
              Every team has phases. This is how INCINERATE ESPORTS grows — from raw ambition to a structured,
              tournament-ready organisation.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/tournaments" className="btn btn-primary">
                <Trophy /> See Tournaments
              </Link>
              <Link to="/achievements" className="btn btn-ghost">
                <Medal /> Achievements
              </Link>
            </div>
          </div>
          <ol className="timeline">
            {TIMELINE.map((it) => (
              <li key={it.t} className="timeline-item">
                <h3 className="text-lg uppercase">{it.t}</h3>
                <p className="text-muted-x">{it.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
