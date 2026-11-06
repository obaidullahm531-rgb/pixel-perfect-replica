import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Cake,
  Contact,
  Crosshair,
  Hash,
  Home as HomeIcon,
  Link2,
  MapPin,
  Shield,
  User,
} from "lucide-react";
import { playerBySlugQuery } from "@/lib/queries";
import { ExternalSocials } from "@/components/site/ui-x";

export const Route = createFileRoute("/players/$slug")({
  loader: async ({ context: { queryClient }, params }) => {
    const player = await queryClient.ensureQueryData(playerBySlugQuery(params.slug));
    if (!player) throw notFound();
    return { ign: player.ign, role: player.role_label || player.role, bio: player.bio, photo: player.photo_url };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Player — INCINERATE ESPORTS" }, { name: "robots", content: "noindex" }] };
    const title = `${loaderData.ign} — ${loaderData.role} | INCINERATE ESPORTS`;
    const description =
      loaderData.bio && loaderData.bio.length > 20
        ? loaderData.bio.slice(0, 155)
        : `${loaderData.ign} plays ${loaderData.role} for INCINERATE ESPORTS, a Garena Free Fire team from Bangladesh.`;
    const meta: Array<Record<string, string>> = [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData.photo && /^https:\/\//.test(loaderData.photo)) {
      meta.push({ property: "og:image", content: loaderData.photo }, { name: "twitter:image", content: loaderData.photo });
    }
    return { meta };
  },
  notFoundComponent: () => (
    <div className="container-x py-24 text-center">
      <h1 className="section-title">Player not found</h1>
      <p className="mt-2 text-muted-x">This profile doesn't exist or is no longer public.</p>
      <Link to="/players" className="btn btn-primary mt-6">
        <ArrowLeft /> All Players
      </Link>
    </div>
  ),
  component: PlayerPage,
});

function PlayerPage() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(playerBySlugQuery(slug));
  if (!p) return null;
  const role = p.role_label || p.role;
  const otherLinks = (p.other_links ?? "")
    .split(/\s|,/)
    .map((s) => s.trim())
    .filter((s) => /^https?:\/\//.test(s));
  const details = [
    { icon: Contact, label: "In-Game Name", value: p.ign },
    { icon: User, label: "Real Name", value: p.real_name },
    { icon: Crosshair, label: "Role", value: role },
    { icon: Hash, label: "Free Fire UID", value: p.ff_uid },
    { icon: Cake, label: "Age", value: p.age ? String(p.age) : null },
    { icon: MapPin, label: "Country", value: p.country },
    { icon: HomeIcon, label: "Address", value: p.address },
  ].filter((d) => d.value);

  return (
    <>
      <section className="player-hero">
        {p.photo_url ? (
          <div className="player-hero-bg" style={{ backgroundImage: `url('${p.photo_url}')` }} aria-hidden="true" />
        ) : null}
        <div className="player-hero-scrim" aria-hidden="true" />
        <div className="container-x relative">
          <nav className="crumbs" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/players">Players</Link>
            <span>/</span>
            <span>{p.ign}</span>
          </nav>
          <div className="grid items-center gap-8 md:grid-cols-[240px_1fr]">
            <div className="player-portrait mx-auto w-full max-w-[240px]">
              {p.photo_url ? (
                <img src={p.photo_url} alt={`${p.ign} — Free Fire player for INCINERATE ESPORTS`} />
              ) : (
                <div className="grid aspect-[3/4] place-items-center rounded-[var(--radius)] border text-muted-x">
                  <User className="h-16 w-16" />
                </div>
              )}
            </div>
            <div className="flex flex-col items-start gap-3">
              <span className="chip chip-fire">{role}</span>
              <h1 className="hero-title !text-[clamp(2.2rem,6vw,4rem)]">{p.ign}</h1>
              {p.real_name ? <p className="text-lg uppercase text-muted-x">{p.real_name}</p> : null}
              <div className="flex flex-wrap gap-2">
                {p.country ? (
                  <span className="chip chip-done">
                    <MapPin /> {p.country}
                  </span>
                ) : null}
                {p.age ? (
                  <span className="chip chip-done">
                    <Cake /> {p.age}
                  </span>
                ) : null}
                <span className="chip chip-done">
                  <Shield /> INCINERATE ESPORTS
                </span>
              </div>
              <ExternalSocials
                name={p.ign}
                links={[
                  { platform: "facebook", url: p.facebook },
                  { platform: "youtube", url: p.youtube },
                  { platform: "instagram", url: p.instagram },
                  { platform: "tiktok", url: p.tiktok },
                  { platform: "discord", url: p.discord },
                ]}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section-x">
        <div className="container-x grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="section-title">
              Player <span className="gradient-text">Profile</span>
            </h2>
            <div className="divider-fire" />
            <div className="article-body mt-5">
              {p.bio ? (
                <p className="whitespace-pre-line font-semibold">{p.bio}</p>
              ) : (
                <p className="text-muted-x">
                  {p.ign} competes as {role} for INCINERATE ESPORTS in Garena Free Fire tournaments.
                </p>
              )}
              {p.experience ? (
                <>
                  <h3 className="mt-6 text-xl uppercase">Experience</h3>
                  <p className="mt-2 whitespace-pre-line font-semibold text-muted-x">{p.experience}</p>
                </>
              ) : null}
              {otherLinks.length ? (
                <>
                  <h3 className="mt-6 text-xl uppercase">Other Links</h3>
                  <ul className="mt-2 space-y-1">
                    {otherLinks.map((l) => (
                      <li key={l}>
                        <a href={l} target="_blank" rel="noopener noreferrer" className="contact-row break-all">
                          <Link2 /> {l}
                        </a>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
            <Link to="/players" className="btn btn-ghost mt-8">
              <ArrowLeft /> All Players
            </Link>
          </div>
          <aside className="flex flex-col gap-5">
            <div className="card-x">
              <div className="card-pad gap-5">
                <h3 className="text-xl uppercase">Player Details</h3>
                {details.map((d) => (
                  <div key={d.label} className="detail-row">
                    <d.icon />
                    <div>
                      <p className="stat-label">{d.label}</p>
                      <p className="stat-value !mt-0.5">{d.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card-x">
              <div className="card-pad">
                <h3 className="text-xl uppercase">Team</h3>
                <p className="text-muted-x">Represents INCINERATE ESPORTS in Garena Free Fire competitions.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
