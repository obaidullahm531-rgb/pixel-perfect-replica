import { describe, expect, it } from "vitest";
import { playerMatchesRole, youtubeId, slugify } from "@/lib/content-rules";
import { DEFAULT_SETTINGS, mergeSettings } from "@/lib/site-settings";

describe("player role filter", () => {
  it("shows a 'Sniper + IGL' player under both Sniper and IGL", () => {
    const snapx = { role: "Sniper", role_label: "Sniper + IGL" };
    expect(playerMatchesRole(snapx, "Sniper")).toBe(true);
    expect(playerMatchesRole(snapx, "IGL")).toBe(true);
    expect(playerMatchesRole(snapx, "Support")).toBe(false);
  });

  it("shows everyone under All Roles", () => {
    expect(playerMatchesRole({ role: "Support" }, "All")).toBe(true);
  });
});

describe("video links", () => {
  it("reads YouTube ids from watch, short and youtu.be links", () => {
    expect(youtubeId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://youtu.be/dQw4w9WgXcQ?t=3")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://www.youtube.com/shorts/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(youtubeId("https://example.com/video.mp4")).toBeNull();
  });
});

describe("profile URL names", () => {
  it("turns in-game names into URL-safe names", () => {
    expect(slugify("INC.LIONX69")).toBe("inclionx69");
    expect(slugify("INC-SILENT")).toBe("inc-silent");
  });
});

describe("site settings", () => {
  it("keeps the brief's slogan and contact email when nothing is saved", () => {
    const s = mergeSettings(null);
    expect(s.slogan).toBe("BURN EVERYTHING. WIN ALWAYS.");
    expect(s.contactEmail).toBe("contact@incinerateesports.com");
  });

  it("uses saved values but falls back for blank ones", () => {
    const s = mergeSettings({ slogan: "NEW SLOGAN", contactEmail: "" });
    expect(s.slogan).toBe("NEW SLOGAN");
    expect(s.contactEmail).toBe(DEFAULT_SETTINGS.contactEmail);
  });
});
