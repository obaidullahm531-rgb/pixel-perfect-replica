import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { socialQuery } from "@/lib/queries";
import { SocialIcon, platformLabel } from "./BrandIcons";

export function TitleAccent({ title, accent, tone = "fire" }: { title: string; accent?: string | undefined; tone?: "fire" | "blue" | undefined }) {
  return (
    <>
      {title}
      {accent ? (
        <>
          {" "}
          <span className={tone === "fire" ? "fire-text" : "gradient-text"}>{accent}</span>
        </>
      ) : null}
    </>
  );
}

export function SectionHead({
  eyebrow,
  icon: Icon,
  title,
  accent,
  tone = "fire",
  sub,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  accent?: string | undefined;
  tone?: "fire" | "blue" | undefined;
  sub?: string | undefined;
}) {
  return (
    <div className="section-head">
      <span className="eyebrow">
        <Icon className="h-3.5 w-3.5" /> {eyebrow}
      </span>
      <h2 className="section-title mt-2">
        <TitleAccent title={title} accent={accent} tone={tone} />
      </h2>
      {sub ? <p className="section-sub">{sub}</p> : null}
    </div>
  );
}

export function PageHead({
  crumb,
  eyebrow,
  icon: Icon,
  title,
  accent,
  after,
  tone = "fire",
  sub,
  children,
}: {
  crumb: string;
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  accent?: string | undefined;
  after?: string | undefined;
  tone?: "fire" | "blue" | undefined;
  sub?: string | undefined;
  children?: ReactNode;
}) {
  return (
    <section className="page-head">
      <div className="container-x">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{crumb}</span>
        </nav>
        <span className="eyebrow">
          <Icon className="h-3.5 w-3.5" /> {eyebrow}
        </span>
        <h1 className="mt-2">
          {title}{" "}
          {accent ? <span className={tone === "fire" ? "fire-text" : "gradient-text"}>{accent}</span> : null}
          {after ? ` ${after}` : null}
        </h1>
        {sub ? <p>{sub}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function EmptyState({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="empty-x">
      <Icon />
      <p>{children}</p>
    </div>
  );
}

export function CardSkeletons({ count = 4, cols = 4, tall = true }: { count?: number; cols?: 3 | 4; tall?: boolean }) {
  return (
    <div className={`grid-cards cols-${cols}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-x" style={{ aspectRatio: tall ? "3 / 4.4" : "4 / 3" }} />
      ))}
    </div>
  );
}

export function SocialButtons({ className = "" }: { className?: string }) {
  const { data } = useQuery(socialQuery);
  if (!data?.length) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {data.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn"
          aria-label={`${s.label || platformLabel(s.platform)} — INCINERATE ESPORTS`}
          title={s.label || platformLabel(s.platform)}
        >
          <SocialIcon platform={s.platform} />
        </a>
      ))}
    </div>
  );
}

export function ExternalSocials({
  links,
  name,
}: {
  links: { platform: string; url: string | null | undefined }[];
  name: string;
}) {
  const valid = links.filter((l) => l.url);
  if (!valid.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {valid.map((l) => (
        <a
          key={l.platform}
          href={l.url!}
          target="_blank"
          rel="noopener noreferrer"
          className="social-btn"
          aria-label={`${name} on ${platformLabel(l.platform)}`}
        >
          <SocialIcon platform={l.platform} />
        </a>
      ))}
    </div>
  );
}
