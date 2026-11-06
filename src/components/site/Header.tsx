import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  Handshake,
  Image as ImageIcon,
  Mail,
  Menu,
  Newspaper,
  UserPlus,
  X,
  Home,
  Info,
  Users,
  Trophy,
  Medal,
} from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { DEFAULT_SETTINGS } from "@/lib/site-settings";

const MAIN = [
  { to: "/", label: "Home", icon: Home },
  { to: "/about", label: "About Us", icon: Info },
  { to: "/players", label: "Players", icon: Users },
  { to: "/tournaments", label: "Tournaments", icon: Trophy },
  { to: "/achievements", label: "Achievements", icon: Medal },
] as const;

const MORE = [
  { to: "/sponsors", label: "Sponsors", icon: Handshake },
  { to: "/news", label: "News", icon: Newspaper },
  { to: "/gallery", label: "Gallery", icon: ImageIcon },
  { to: "/join", label: "Join Our Team", icon: UserPlus },
  { to: "/contact", label: "Contact Us", icon: Mail },
] as const;

export function Brand() {
  const { data } = useQuery(settingsQuery);
  const s = data ?? DEFAULT_SETTINGS;
  return (
    <Link to="/" className="brand" aria-label={`${s.orgName} ${s.orgSub} home`}>
      <img src={s.logoUrl} alt={`${s.orgName} ${s.orgSub} logo`} className="brand-logo" width={54} height={54} />
      <span className="brand-words">
        <span className="brand-name">{s.orgName}</span>
        <span className="brand-sub">{s.orgSub}</span>
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const isActive = (to: string) => (to === "/" ? pathname === "/" : pathname === to || pathname.startsWith(`${to}/`));
  const moreActive = MORE.some((m) => isActive(m.to));

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="container-x flex h-[70px] items-center justify-between gap-4 md:h-[78px]">
        <Brand />
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {MAIN.map((l) => (
            <Link key={l.to} to={l.to} className={`nav-link ${isActive(l.to) ? "is-active" : ""}`}>
              {l.label}
            </Link>
          ))}
          <div className="nav-more">
            <button type="button" className={`nav-link ${moreActive ? "is-active" : ""}`} aria-haspopup="true">
              More <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <div className="nav-more-panel">
              <div className="nav-more-inner">
                {MORE.map((l) => (
                  <Link key={l.to} to={l.to} className={`nav-more-link ${isActive(l.to) ? "is-active" : ""}`}>
                    <l.icon className="h-4 w-4" /> {l.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>
        <button
          type="button"
          className="nav-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="mobile-menu animate-in fade-in slide-in-from-top-2">
          <nav className="container-x grid gap-1 py-3 sm:grid-cols-2" aria-label="Mobile navigation">
            {[...MAIN, ...MORE].map((l) => (
              <Link key={l.to} to={l.to} className={`mobile-link ${isActive(l.to) ? "is-active" : ""}`}>
                <l.icon className="h-4 w-4" /> {l.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
