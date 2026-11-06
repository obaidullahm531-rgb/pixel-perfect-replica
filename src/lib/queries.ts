import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { mergeSettings } from "./site-settings";

export type Player = Tables<"players">;
export type Manager = Tables<"managers">;
export type Tournament = Tables<"tournaments">;
export type Achievement = Tables<"achievements">;
export type Sponsor = Tables<"sponsors">;
export type NewsItem = Tables<"news">;
export type GalleryItem = Tables<"gallery">;
export type Video = Tables<"videos">;
export type SocialLink = Tables<"social_links">;

export const settingsQuery = queryOptions({
  queryKey: ["public", "settings"],
  queryFn: async () => {
    const { data, error } = await supabase.from("site_settings").select("data").eq("id", 1).maybeSingle();
    if (error) throw error;
    return mergeSettings(data?.data);
  },
  staleTime: 60_000,
});

export const playersQuery = queryOptions({
  queryKey: ["public", "players"],
  queryFn: async (): Promise<Player[]> => {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .order("created_at");
    if (error) throw error;
    return data;
  },
  staleTime: 30_000,
});

export const playerBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public", "player", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const managersQuery = queryOptions({
  queryKey: ["public", "managers"],
  queryFn: async (): Promise<Manager[]> => {
    const { data, error } = await supabase.from("managers").select("*").eq("published", true).order("sort_order");
    if (error) throw error;
    return data;
  },
  staleTime: 30_000,
});

export const tournamentsQuery = queryOptions({
  queryKey: ["public", "tournaments"],
  queryFn: async (): Promise<Tournament[]> => {
    const { data, error } = await supabase
      .from("tournaments")
      .select("*")
      .eq("published", true)
      .order("sort_order")
      .order("start_date", { ascending: false, nullsFirst: false });
    if (error) throw error;
    return data;
  },
  staleTime: 30_000,
});

export const achievementsQuery = queryOptions({
  queryKey: ["public", "achievements"],
  queryFn: async (): Promise<Achievement[]> => {
    const { data, error } = await supabase
      .from("achievements")
      .select("*")
      .eq("published", true)
      .order("achieved_on", { ascending: false, nullsFirst: false })
      .order("sort_order");
    if (error) throw error;
    return data;
  },
  staleTime: 30_000,
});

export const sponsorsQuery = queryOptions({
  queryKey: ["public", "sponsors"],
  queryFn: async (): Promise<Sponsor[]> => {
    const { data, error } = await supabase.from("sponsors").select("*").eq("published", true).order("sort_order");
    if (error) throw error;
    return data;
  },
  staleTime: 30_000,
});

export const newsQuery = queryOptions({
  queryKey: ["public", "news"],
  queryFn: async (): Promise<NewsItem[]> => {
    const { data, error } = await supabase
      .from("news")
      .select("*")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return data;
  },
  staleTime: 30_000,
});

export const newsBySlugQuery = (slug: string) =>
  queryOptions({
    queryKey: ["public", "news", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const galleryQuery = queryOptions({
  queryKey: ["public", "gallery"],
  queryFn: async (): Promise<GalleryItem[]> => {
    const { data, error } = await supabase.from("gallery").select("*").eq("published", true).order("sort_order");
    if (error) throw error;
    return data;
  },
  staleTime: 30_000,
});

export const videosQuery = queryOptions({
  queryKey: ["public", "videos"],
  queryFn: async (): Promise<Video[]> => {
    const { data, error } = await supabase.from("videos").select("*").eq("published", true).order("sort_order");
    if (error) throw error;
    return data;
  },
  staleTime: 30_000,
});

export const socialQuery = queryOptions({
  queryKey: ["public", "social"],
  queryFn: async (): Promise<SocialLink[]> => {
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .eq("published", true)
      .order("sort_order");
    if (error) throw error;
    return data;
  },
  staleTime: 60_000,
});
