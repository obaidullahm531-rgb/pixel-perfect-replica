import { DEFAULT_SETTINGS, type SeoEntry, type SeoPage } from "./site-settings";

export function seoMeta(seo: SeoEntry | undefined, page: SeoPage, image?: string | null) {
  const s = seo?.title ? seo : DEFAULT_SETTINGS.seo[page];
  const meta: Array<Record<string, string>> = [
    { title: s.title },
    { name: "description", content: s.description },
    { property: "og:title", content: s.title },
    { property: "og:description", content: s.description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: s.title },
    { name: "twitter:description", content: s.description },
  ];
  if (image && /^https:\/\//.test(image)) {
    meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  }
  return meta;
}
