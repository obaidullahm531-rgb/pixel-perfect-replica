import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin } from "lucide-react";
import { settingsQuery } from "@/lib/queries";
import { DEFAULT_SETTINGS } from "@/lib/site-settings";
import { Brand } from "./Header";
import { SocialButtons } from "./ui-x";

export function Footer() {
  const { data } = useQuery(settingsQuery);
  const s = data ?? DEFAULT_SETTINGS;
  return (
    <footer className="site-footer">
      <div className="container-x">
        <div className="footer-grid">
          <div>
            <Brand />
            <p className="mt-4 text-muted-x">{s.footerDescription}</p>
            <p className="hero-tag !mt-1 !text-sm fire-text">{s.slogan}</p>
            <SocialButtons className="mt-4" />
          </div>
          <div>
            <h3 className="footer-title">Quick Links</h3>
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/about" className="footer-link">About Us</Link>
            <Link to="/players" className="footer-link">Players</Link>
            <Link to="/tournaments" className="footer-link">Tournaments</Link>
            <Link to="/achievements" className="footer-link">Achievements</Link>
          </div>
          <div>
            <h3 className="footer-title">Explore</h3>
            <Link to="/news" className="footer-link">News</Link>
            <Link to="/gallery" className="footer-link">Gallery</Link>
            <Link to="/sponsors" className="footer-link">Sponsors</Link>
            <Link to="/join" className="footer-link">Join Our Team</Link>
            <Link to="/contact" className="footer-link">Contact Us</Link>
          </div>
          <div>
            <h3 className="footer-title">Contact</h3>
            <a href={`mailto:${s.contactEmail}`} className="footer-link break-all">
              <Mail className="h-4 w-4 flex-none" /> {s.contactEmail}
            </a>
            <span className="footer-link">
              <MapPin className="h-4 w-4 flex-none" /> {s.location}
            </span>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{s.copyright}</span>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary">Terms &amp; Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
