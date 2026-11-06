import logoAsset from "@/assets/logo.png.asset.json";
import heroAsset from "@/assets/hero.jpg.asset.json";

export type SeoEntry = { title: string; description: string };

export type SiteSettings = {
  orgName: string;
  orgSub: string;
  slogan: string;
  game: string;
  country: string;
  logoUrl: string;
  heroImageUrl: string;
  heroTitleTop: string;
  heroTitleBottom: string;
  heroDescription: string;
  whoTitle: string;
  whoBody1: string;
  whoBody2: string;
  whoBody3: string;
  values: { title: string; text: string }[];
  sections: {
    players: boolean;
    managers: boolean;
    tournaments: boolean;
    achievements: boolean;
    news: boolean;
    sponsors: boolean;
    highlights: boolean;
  };
  contactEmail: string;
  location: string;
  locationLong: string;
  footerDescription: string;
  copyright: string;
  aboutStory: string[];
  mission: string;
  vision: string;
  goals: string;
  seo: Record<SeoPage, SeoEntry>;
};

export const SEO_PAGES = [
  "home",
  "about",
  "players",
  "tournaments",
  "achievements",
  "sponsors",
  "news",
  "gallery",
  "contact",
  "join",
] as const;
export type SeoPage = (typeof SEO_PAGES)[number];

export const DEFAULT_SETTINGS: SiteSettings = {
  orgName: "INCINERATE",
  orgSub: "ESPORTS",
  slogan: "BURN EVERYTHING. WIN ALWAYS.",
  game: "Garena Free Fire",
  country: "Bangladesh",
  logoUrl: logoAsset.url,
  heroImageUrl: heroAsset.url,
  heroTitleTop: "INCINERATE",
  heroTitleBottom: "ESPORTS",
  heroDescription:
    "INCINERATE ESPORTS is a competitive Garena Free Fire organization built on discipline, aggression and relentless practice. From local lobbies to national tournaments, we compete to win — and we bring our community with us.",
  whoTitle: "Forged for Free Fire competition",
  whoBody1:
    "INCINERATE ESPORTS is a competitive Garena Free Fire organization. We build complete squads — IGLs who read the map, rushers who break formations, snipers who hold angles and supports who keep the team alive — and we prepare them for tournament play.",
  whoBody2:
    "Our mission is simple: represent Bangladesh on the Free Fire stage with disciplined, aggressive and intelligent play.",
  whoBody3:
    "Our vision is a self-sustaining esports organisation that develops players from the ground up and gives them a platform to be seen.",
  values: [
    { title: "Discipline", text: "Structured practice, scrims and review — every session has a purpose." },
    { title: "Aggression", text: "We take fights on our terms and dictate the pace of every match." },
    { title: "Teamwork", text: "Roles are defined, communication is constant and nobody plays alone." },
    { title: "Growth", text: "We develop raw talent into tournament-ready Free Fire players." },
  ],
  sections: {
    players: true,
    managers: true,
    tournaments: true,
    achievements: true,
    news: true,
    sponsors: true,
    highlights: true,
  },
  contactEmail: "contact@incinerateesports.com",
  location: "Dhaka, Bangladesh",
  locationLong: "Competing and representing from Dhaka, Bangladesh.",
  footerDescription:
    "Competitive Garena Free Fire esports organization from Bangladesh. Built on discipline, aggression and an unbreakable community.",
  copyright: "© 2026 INCINERATE ESPORTS. All rights reserved.",
  aboutStory: [
    "INCINERATE ESPORTS started as a group of Free Fire players who refused to settle for casual lobbies. What began as late-night scrims and ranked grinds became a structured organization with defined roles, practice schedules and a clear competitive goal.",
    "Today we field a dedicated roster, support an active community and compete in Garena Free Fire tournaments. Every match is a chance to prove that a team built on discipline and aggression can stand with anyone.",
    "We are proud to represent Bangladesh, and we are building an organization that players want to join, fans want to follow and partners want to support.",
  ],
  mission:
    "To compete at the highest level of Garena Free Fire with disciplined, aggressive play, and to represent Bangladesh with pride in every tournament we enter.",
  vision:
    "To become a recognised Free Fire esports organization that develops local talent, builds a loyal community and earns the trust of partners and sponsors.",
  goals:
    "Build a complete tournament-ready roster, compete consistently, publish our results transparently and grow a supportive Free Fire community.",
  seo: {
    home: {
      title: "INCINERATE ESPORTS — Garena Free Fire Team from Bangladesh",
      description:
        "INCINERATE ESPORTS is a competitive Garena Free Fire organization from Bangladesh. Burn everything. Win always.",
    },
    about: {
      title: "About Us — INCINERATE ESPORTS",
      description:
        "The INCINERATE story: who we are, what we stand for, and where we are taking Free Fire esports in Bangladesh.",
    },
    players: {
      title: "Our Players — INCINERATE ESPORTS Free Fire Roster",
      description: "Meet the INCINERATE ESPORTS Garena Free Fire roster: rushers, snipers, IGLs and supports.",
    },
    tournaments: {
      title: "Tournaments — INCINERATE ESPORTS",
      description: "Upcoming, ongoing and completed Garena Free Fire tournaments featuring INCINERATE ESPORTS.",
    },
    achievements: {
      title: "Achievements & Results — INCINERATE ESPORTS",
      description: "Tournament positions, prize results and standout performances from INCINERATE ESPORTS.",
    },
    sponsors: {
      title: "Sponsors & Partners — INCINERATE ESPORTS",
      description: "Organizations supporting INCINERATE ESPORTS. Partner with a growing Free Fire esports brand in Bangladesh.",
    },
    news: {
      title: "News & Announcements — INCINERATE ESPORTS",
      description: "Official announcements, roster updates, tournament news and results from INCINERATE ESPORTS.",
    },
    gallery: {
      title: "Gallery — INCINERATE ESPORTS",
      description: "Team photos, tournaments, match highlights, victory celebrations and behind-the-scenes moments.",
    },
    contact: {
      title: "Contact Us — INCINERATE ESPORTS",
      description: "Questions, partnership proposals or player enquiries — reach the INCINERATE ESPORTS management team.",
    },
    join: {
      title: "Join Our Team — INCINERATE ESPORTS Recruitment",
      description: "Recruitment for the INCINERATE ESPORTS Garena Free Fire roster is open. Submit your application.",
    },
  },
};

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Deep-merge stored settings over defaults so missing keys always fall back. */
export function mergeSettings(stored: unknown): SiteSettings {
  const merge = (base: unknown, over: unknown): unknown => {
    if (over === undefined || over === null || over === "") return base;
    if (Array.isArray(base)) return Array.isArray(over) && over.length ? over : base;
    if (isObject(base) && isObject(over)) {
      const out: Record<string, unknown> = { ...base };
      for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
      return out;
    }
    return over;
  };
  return merge(DEFAULT_SETTINGS, stored) as SiteSettings;
}

export function settingsToJson(s: SiteSettings): Json {
  return JSON.parse(JSON.stringify(s)) as Json;
}
