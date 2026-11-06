import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Calendar,
  Clapperboard,
  Flame,
  Handshake,
  Images,
  Info,
  List,
  Medal,
  Newspaper,
  Shield,
  Swords,
  Target,
  Trophy,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import {
  achievementsQuery,
  managersQuery,
  newsQuery,
  playersQuery,
  settingsQuery,
  sponsorsQuery,
  tournamentsQuery,
  videosQuery,
} from "@/lib/queries";
import { seoMeta } from "@/lib/seo";
import { SectionHead, SocialButtons } from "@/components/site/ui-x";
import {
  AchievementCard,
  ManagerCard,
  NewsCard,
  PlayerCard,
  SponsorCard,
  TournamentCard,
  VideoCard,
} from "@/components/site/Cards";

export const Route = createFileRoute("/")({
  loader: async ({ context: { queryClient } }) => {
    const [settings] = await Promise.all([
      queryClient.ensureQueryData(settingsQuery),
      queryClient.ensureQueryData(playersQuery),
      queryClient.ensureQueryData(managersQuery),
      queryClient.ensureQueryData(tournamentsQuery),
      queryClient.ensureQueryData(achievementsQuery),
      queryClient.ensureQueryData(newsQuery),
      queryClient.ensureQueryData(sponsorsQuery),
      queryClient.ensureQueryData(videosQuery),
    ]);
    return { seo: settings.seo.home };
  },
  head: ({ loaderData }) => ({ meta: seoMeta(loaderData?.seo, "home") }),
  component: Home,
});

const VALUE_ICONS = [Target, Swords, Users, Flame];

function Home() {
  const { data: s } = useSuspenseQuery(settingsQuery);
  const { data: players } = useSuspenseQuery(playersQuery);
  const { data: managers } = useSuspenseQuery(managersQuery);
  const { data: tournaments } = useSuspenseQuery(tournamentsQuery);
  const { data: achievements } = useSuspenseQuery(achievementsQuery);
  const { data: news } = useSuspenseQuery(newsQuery);
  const { data: sponsors } = useSuspenseQuery(sponsorsQuery);
  const { data: videos } = useSuspenseQuery(videosQuery);

  const featured = (players.filter((p) => p.featured).length ? players.filter((p) => p.featured) : players).slice(0, 4);
  const liveTournaments = tournaments.filter((t) => t.status !== "completed").slice(0, 3);

  return (
    <>
      {/* A. Hero */}
      <section className="hero-x">
        <div className="hero-bg" style={{ backgroundImage: `url('${s.heroImageUrl}')` }} aria-hidden="true" />
        <div className="hero-scrim" aria-hidden="true" />
        <div className="container-x relative animate-rise">
          <h1 className="hero-title">
            {s.heroTitleTop}
            <br />
            <span className="fire-text">{s.heroTitleBottom}</span>
          </h1>
          <p className="hero-tag">{s.slogan}</p>
          <p className="hero-copy">{s.heroDescription}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/players" className="btn btn-ghost">
              <Users /> View Players
            </Link>
          </div>
        </div>
      </section>

      {/* B + C. Who we are + values */}
      <section className="section-x">
        <div className="container-x grid items-start gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow">
              <Shield className="h-3.5 w-3.5" /> Who We Are
            </span>
            <h2 className="section-title mt-2">
              {s.whoTitle.split(" ").slice(0, 2).join(" ")}{" "}
              <span className="gradient-text">{s.whoTitle.split(" ").slice(2).join(" ")}</span>
            </h2>
            <div className="divider-fire" />
            <div className="mt-5 space-y-3 text-muted-x">
              <p>{s.whoBody1}</p>
              <p>{s.whoBody2}</p>
              <p>{s.whoBody3}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/about" className="btn btn-primary">
                <Info /> About the Organisation
              </Link>
              <Link to="/join" className="btn btn-ghost">
                <UserPlus /> Try Out for the Roster
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {s.values.map((v, i) => {
              const Icon = VALUE_ICONS[i % VALUE_ICONS.length] ?? Target;
              return (
                <div key={v.title} className="card-x hoverable">
                  <div className="card-pad">
                    <Icon className="feature-icon" />
                    <h3 className="card-title mt-1">{v.title}</h3>
                    <p className="text-[0.95rem] text-muted-x">{v.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* D. Featured players */}
      {s.sections.players ? (
        <section className="section-x section-alt">
          <div className="container-x">
            <SectionHead
              eyebrow="The Roster"
              icon={Users}
              title="Featured"
              accent="Players"
              sub="Meet the competitors carrying the INCINERATE ESPORTS name into Free Fire lobbies."
            />
            <div className="grid-cards cols-4">
              {featured.map((p) => (
                <PlayerCard key={p.id} player={p} />
              ))}
            </div>
            <Link to="/players" className="btn btn-ghost mt-8">
              <List /> View Full Roster
            </Link>
          </div>
        </section>
      ) : null}

      {/* E. Managers */}
      {s.sections.managers && managers.length ? (
        <section className="section-x">
          <div className="container-x">
            <SectionHead
              eyebrow="Management"
              icon={User}
              title="Team"
              accent="Managers"
              tone="blue"
              sub="The people running the organisation — rosters, schedules, partnerships and day-to-day operations."
            />
            <div className="grid-cards cols-3">
              {managers.map((m) => (
                <ManagerCard key={m.id} manager={m} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* F. Tournaments */}
      {s.sections.tournaments ? (
        <section className="section-x">
          <div className="container-x">
            <SectionHead
              eyebrow="Competition"
              icon={Trophy}
              title="Upcoming & Live"
              accent="Tournaments"
              tone="blue"
              sub="Where INCINERATE ESPORTS competes — schedules, prize pools and live streams."
            />
            {liveTournaments.length ? (
              <div className="grid-cards cols-3 mb-8">
                {liveTournaments.map((t) => (
                  <TournamentCard key={t.id} t={t} />
                ))}
              </div>
            ) : null}
            <Link to="/tournaments" className="btn btn-ghost">
              <Calendar /> All Tournaments
            </Link>
          </div>
        </section>
      ) : null}

      {/* G. Achievements */}
      {s.sections.achievements ? (
        <section className="section-x">
          <div className="container-x">
            <SectionHead
              eyebrow="Results"
              icon={Medal}
              title="Recent"
              accent="Achievements"
              sub="Positions, prize results and standout performances from our competitive journey."
            />
            {achievements.length ? (
              <div className="grid-cards cols-3 mb-8">
                {achievements.slice(0, 3).map((a) => (
                  <AchievementCard key={a.id} a={a} />
                ))}
              </div>
            ) : null}
            <Link to="/achievements" className="btn btn-ghost">
              <Trophy /> All Achievements
            </Link>
          </div>
        </section>
      ) : null}

      {/* H. News */}
      {s.sections.news ? (
        <section className="section-x">
          <div className="container-x">
            <SectionHead
              eyebrow="Newsroom"
              icon={Newspaper}
              title="Latest"
              accent="News"
              tone="blue"
              sub="Announcements, roster updates, tournament news and results from the organisation."
            />
            {news.length ? (
              <div className="grid-cards cols-3 mb-8">
                {news.slice(0, 3).map((n) => (
                  <NewsCard key={n.id} n={n} />
                ))}
              </div>
            ) : null}
            <Link to="/news" className="btn btn-ghost">
              <Newspaper /> All News
            </Link>
          </div>
        </section>
      ) : null}

      {/* I. Sponsors */}
      {s.sections.sponsors ? (
        <section className="section-x section-alt">
          <div className="container-x">
            <SectionHead
              eyebrow="Partners"
              icon={Handshake}
              title="Sponsors &"
              accent="Partners"
              tone="blue"
              sub="Organizations supporting INCINERATE ESPORTS and Free Fire esports in Bangladesh."
            />
            {sponsors.length ? (
              <div className="grid-cards cols-3 mb-8">
                {sponsors.map((sp) => (
                  <SponsorCard key={sp.id} sponsor={sp} />
                ))}
              </div>
            ) : null}
            <Link to="/sponsors" className="btn btn-ghost">
              <Handshake /> Sponsorship Opportunities
            </Link>
          </div>
        </section>
      ) : null}

      {/* J + K. Highlights + follow */}
      <section className="section-x">
        <div className="container-x">
          {s.sections.highlights ? (
            <>
              <SectionHead
                eyebrow="Media"
                icon={Clapperboard}
                title="Match"
                accent="Highlights"
                sub="Clips, clutch plays and tournament moments. Tap any highlight to play it right here — and follow our channels so you never miss a match."
              />
              {videos.length ? (
                <div className="grid-cards cols-3 mb-8">
                  {videos.map((v) => (
                    <VideoCard key={v.id} v={v} />
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
          <div className="follow-panel">
            <div>
              <h3 className="text-xl uppercase">Follow the Organisation</h3>
              <p className="text-sm text-muted-x">Live streams, announcements and behind-the-scenes content.</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <SocialButtons />
              <Link to="/gallery" className="btn btn-ghost btn-sm">
                <Images /> Open Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
