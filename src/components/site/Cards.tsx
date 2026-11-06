import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight,
  Calendar,
  Clock,
  Coins,
  Crown,
  ExternalLink,
  Mail,
  MapPin,
  Medal,
  Phone,
  Play,
  Radio,
  Trophy,
  User,
  Users,
  Globe,
} from "lucide-react";
import type { Achievement, Manager, NewsItem, Player, Sponsor, Tournament, Video } from "@/lib/queries";
import { formatDate, statusLabel, youtubeThumb } from "@/lib/content-rules";
import { DetailModal, Lightbox } from "./Overlay";
import { ExternalSocials } from "./ui-x";

export function PlayerCard({ player, showCountry = false }: { player: Player; showCountry?: boolean }) {
  return (
    <Link
      to="/players/$slug"
      params={{ slug: player.slug }}
      className="card-x player-card"
      aria-label={`${player.ign} — ${player.role_label || player.role} at INCINERATE ESPORTS`}
    >
      <div className="media-frame">
        {player.photo_url ? (
          <img src={player.photo_url} alt={`${player.ign} — ${player.role_label || player.role}`} loading="lazy" />
        ) : (
          <div className="grid h-full place-items-center text-muted-x">
            <User className="h-14 w-14" />
          </div>
        )}
        <span className="player-role chip chip-fire">{player.role_label || player.role}</span>
      </div>
      <div className="card-pad">
        <h3 className="player-name">{player.ign}</h3>
        {player.real_name ? <p className="player-real">{player.real_name}</p> : null}
        {showCountry && player.country ? (
          <p className="player-real flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" /> {player.country}
          </p>
        ) : null}
        <span className="card-cta">
          View Profile <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

export function ManagerCard({ manager }: { manager: Manager }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="card-x hoverable cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
        aria-label={`${manager.name} — ${manager.position}`}
      >
        <div className="media-frame manager-frame">
          {manager.photo_url ? (
            <img src={manager.photo_url} alt={`${manager.name} — ${manager.position}`} loading="lazy" />
          ) : (
            <div className="grid h-full place-items-center text-muted-x">
              <User className="h-14 w-14" />
            </div>
          )}
          <span className="player-role chip chip-fire">{manager.position}</span>
        </div>
        <div className="card-pad">
          <h3 className="player-name">{manager.name}</h3>
          {manager.age ? <p className="player-real">{manager.age} years old</p> : null}
          {manager.bio ? <p className="text-muted-x text-[0.95rem]">{manager.bio}</p> : null}
          <div className="mt-2 flex flex-col gap-1" onClick={(e) => e.stopPropagation()}>
            {manager.email ? (
              <a href={`mailto:${manager.email}`} className="contact-row">
                <Mail /> {manager.email}
              </a>
            ) : null}
            {manager.phone ? (
              <a href={`tel:${manager.phone.replace(/\s/g, "")}`} className="contact-row">
                <Phone /> {manager.phone}
              </a>
            ) : null}
          </div>
          <div className="mt-3" onClick={(e) => e.stopPropagation()}>
            <ExternalSocials
              name={manager.name}
              links={[
                { platform: "facebook", url: manager.facebook },
                { platform: "instagram", url: manager.instagram },
              ]}
            />
          </div>
        </div>
      </div>
      {open ? (
        <DetailModal onClose={() => setOpen(false)} label={manager.name}>
          <div className="grid gap-6 md:grid-cols-[280px_1fr]">
            {manager.photo_url ? (
              <img
                src={manager.photo_url}
                alt={manager.name}
                className="aspect-square w-full rounded-[var(--radius)] border object-cover"
              />
            ) : null}
            <div className="flex flex-col items-start gap-2">
              <span className="chip chip-fire">{manager.position}</span>
              <h3 className="text-2xl uppercase md:text-3xl">{manager.name}</h3>
              {manager.age ? <p className="text-muted-x">{manager.age} years old</p> : null}
              {manager.bio ? <p className="text-muted-x">{manager.bio}</p> : null}
              {manager.email ? (
                <a href={`mailto:${manager.email}`} className="contact-row">
                  <Mail /> {manager.email}
                </a>
              ) : null}
              {manager.phone ? (
                <a href={`tel:${manager.phone.replace(/\s/g, "")}`} className="contact-row">
                  <Phone /> {manager.phone}
                </a>
              ) : null}
              <ExternalSocials
                name={manager.name}
                links={[
                  { platform: "facebook", url: manager.facebook },
                  { platform: "instagram", url: manager.instagram },
                ]}
              />
            </div>
          </div>
        </DetailModal>
      ) : null}
    </>
  );
}

export function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  const [open, setOpen] = useState(false);
  const individual = sponsor.sponsor_type === "individual";
  return (
    <>
      <div
        className="card-x hoverable cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
        aria-label={`${sponsor.name} — ${sponsor.tier ?? "Sponsor"}`}
      >
        {individual ? (
          <div className="media-frame sponsor-photo">
            {sponsor.logo_url ? <img src={sponsor.logo_url} alt={`${sponsor.name} — supporter`} loading="lazy" /> : null}
            <span className="player-role chip chip-fire">
              <User /> Individual Supporter
            </span>
          </div>
        ) : (
          <div className="grid min-h-[150px] place-items-center p-6">
            {sponsor.logo_url ? (
              <img src={sponsor.logo_url} alt={`${sponsor.name} logo`} className="max-h-[108px] max-w-[82%] object-contain" />
            ) : (
              <span className="card-title">{sponsor.name}</span>
            )}
          </div>
        )}
        <div className="card-pad">
          <h3 className="player-name">{sponsor.name}</h3>
          {sponsor.tier ? (
            <span className="chip chip-gold w-full">
              <Crown /> {sponsor.tier}
            </span>
          ) : null}
          <span className="card-cta">
            View Details <ArrowRight />
          </span>
        </div>
      </div>
      {open ? (
        <DetailModal onClose={() => setOpen(false)} label={sponsor.name}>
          <div className={`grid gap-6 ${sponsor.logo_url ? "md:grid-cols-[300px_1fr]" : ""}`}>
            {sponsor.logo_url ? (
              <img
                src={sponsor.logo_url}
                alt={sponsor.name}
                className={`w-full rounded-[var(--radius)] border ${individual ? "aspect-[3/4] object-cover" : "object-contain p-6"}`}
              />
            ) : null}
            <div className="flex flex-col items-start gap-3">
              <span className="chip chip-fire">{individual ? "Individual Supporter" : "Corporate Partner"}</span>
              <h3 className="text-2xl uppercase md:text-3xl">{sponsor.name}</h3>
              {sponsor.tier ? (
                <span className="chip chip-gold">
                  <Crown /> {sponsor.tier}
                </span>
              ) : null}
              {sponsor.description ? <p className="text-muted-x">{sponsor.description}</p> : null}
              {sponsor.website ? (
                <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className="contact-row">
                  <Globe /> Visit website
                </a>
              ) : null}
            </div>
          </div>
        </DetailModal>
      ) : null}
    </>
  );
}

const statusChip: Record<string, string> = { upcoming: "chip", ongoing: "chip chip-live", completed: "chip chip-done" };

export function TournamentCard({ t }: { t: Tournament }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="card-x hoverable cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
      >
        <div className="media-frame aspect-video">
          {t.banner_url ? (
            <img src={t.banner_url} alt={t.name} loading="lazy" />
          ) : (
            <div className="grid h-full place-items-center text-muted-x">
              <Trophy className="h-12 w-12" />
            </div>
          )}
          <span className={`player-role ${statusChip[t.status] ?? "chip"}`}>
            {t.status === "ongoing" ? <Radio /> : null} {statusLabel(t.status)}
          </span>
        </div>
        <div className="card-pad">
          <h3 className="player-name">{t.name}</h3>
          {t.organizer ? <p className="player-real">by {t.organizer}</p> : null}
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[0.92rem] text-muted-x">
            {t.start_date ? (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" /> {formatDate(t.start_date)}
              </span>
            ) : null}
            {t.start_time ? (
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" /> {t.start_time}
              </span>
            ) : null}
            {t.prize_pool ? (
              <span className="flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-primary" /> {t.prize_pool}
              </span>
            ) : null}
          </div>
          <span className="card-cta">
            View Details <ArrowRight />
          </span>
        </div>
      </div>
      {open ? (
        <DetailModal onClose={() => setOpen(false)} label={t.name}>
          {t.banner_url ? <img src={t.banner_url} alt={t.name} className="article-img aspect-video object-cover" /> : null}
          <span className={statusChip[t.status] ?? "chip"}>{statusLabel(t.status)}</span>
          <h3 className="mt-2 text-2xl uppercase md:text-3xl">{t.name}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {t.organizer ? <Stat label="Organizer" value={t.organizer} /> : null}
            {t.start_date ? <Stat label="Start Date" value={formatDate(t.start_date)} /> : null}
            {t.start_time ? <Stat label="Start Time" value={t.start_time} /> : null}
            {t.prize_pool ? <Stat label="Prize Pool" value={t.prize_pool} /> : null}
          </div>
          {t.description ? <p className="mt-4 text-muted-x whitespace-pre-line">{t.description}</p> : null}
          {t.schedule ? (
            <div className="mt-4">
              <p className="stat-label">Match Schedule</p>
              <p className="mt-1 whitespace-pre-line text-muted-x">{t.schedule}</p>
            </div>
          ) : null}
          {t.result ? (
            <div className="mt-4">
              <p className="stat-label">Result</p>
              <p className="mt-1 whitespace-pre-line">{t.result}</p>
            </div>
          ) : null}
          {t.stream_url ? (
            <a href={t.stream_url} target="_blank" rel="noopener noreferrer" className="btn btn-fire mt-5">
              <Play /> Watch Live Stream
            </a>
          ) : null}
        </DetailModal>
      ) : null}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="stat-box">
      <span className="stat-label">{label}</span>
      <span className="stat-value">{value}</span>
    </div>
  );
}

export function AchievementCard({ a }: { a: Achievement }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div
        className="card-x hoverable cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setOpen(true)}
      >
        <div className="media-frame aspect-video">
          {a.banner_url ? (
            <img src={a.banner_url} alt={a.tournament_name} loading="lazy" />
          ) : (
            <div className="grid h-full place-items-center text-muted-x">
              <Medal className="h-12 w-12" />
            </div>
          )}
          {a.position ? (
            <span className="player-role chip chip-gold">
              <Trophy /> {a.position}
            </span>
          ) : null}
        </div>
        <div className="card-pad">
          <h3 className="player-name">{a.tournament_name}</h3>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.92rem] text-muted-x">
            {a.achieved_on ? (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-primary" /> {formatDate(a.achieved_on)}
              </span>
            ) : null}
            {a.prize_money ? (
              <span className="flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-primary" /> {a.prize_money}
              </span>
            ) : null}
          </div>
          <span className="card-cta">
            View Result <ArrowRight />
          </span>
        </div>
      </div>
      {open ? (
        <DetailModal onClose={() => setOpen(false)} label={a.tournament_name}>
          {a.banner_url ? (
            <img src={a.banner_url} alt={a.tournament_name} className="article-img aspect-video object-cover" />
          ) : null}
          {a.position ? (
            <span className="chip chip-gold">
              <Trophy /> {a.position}
            </span>
          ) : null}
          <h3 className="mt-2 text-2xl uppercase md:text-3xl">{a.tournament_name}</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {a.achieved_on ? <Stat label="Date" value={formatDate(a.achieved_on)} /> : null}
            {a.prize_money ? <Stat label="Prize Money" value={a.prize_money} /> : null}
          </div>
          {a.team_members ? (
            <div className="mt-4">
              <p className="stat-label flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" /> Team Members
              </p>
              <p className="mt-1 whitespace-pre-line">{a.team_members}</p>
            </div>
          ) : null}
          {a.details ? <p className="mt-4 whitespace-pre-line text-muted-x">{a.details}</p> : null}
        </DetailModal>
      ) : null}
    </>
  );
}

export function NewsCard({ n }: { n: NewsItem }) {
  return (
    <Link to="/news/$slug" params={{ slug: n.slug }} className="card-x">
      <div className="media-frame aspect-video">
        {n.image_url ? (
          <img src={n.image_url} alt={n.title} loading="lazy" />
        ) : (
          <div className="grid h-full place-items-center text-muted-x">
            <ExternalLink className="h-10 w-10" />
          </div>
        )}
        <span className="player-role chip">{n.category}</span>
      </div>
      <div className="card-pad">
        <p className="flex items-center gap-1.5 text-[0.88rem] text-muted-x">
          <Calendar className="h-3.5 w-3.5 text-primary" /> {formatDate(n.published_at)}
        </p>
        <h3 className="player-name leading-snug">{n.title}</h3>
        {n.excerpt ? <p className="text-muted-x text-[0.95rem] line-clamp-3">{n.excerpt}</p> : null}
        <span className="card-cta">
          Read More <ArrowRight />
        </span>
      </div>
    </Link>
  );
}

export function VideoCard({ v }: { v: Video }) {
  const [open, setOpen] = useState(false);
  const thumb = v.thumbnail_url || youtubeThumb(v.video_url);
  return (
    <>
      <button
        type="button"
        className="gallery-item text-left"
        onClick={() => setOpen(true)}
        aria-label={`Play ${v.title}`}
      >
        {thumb ? <img src={thumb} alt={`${v.title} — match highlight`} loading="lazy" /> : <div className="aspect-[4/3]" />}
        <span className="gallery-badge chip chip-fire">{v.category || "Match Highlights"}</span>
        <span className="gallery-play">
          <span className="play-dot">
            <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
          </span>
        </span>
        <span className="gallery-caption">{v.title}</span>
      </button>
      {open ? (
        <Lightbox item={{ videoUrl: v.video_url, imageUrl: thumb, caption: v.title }} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
}
