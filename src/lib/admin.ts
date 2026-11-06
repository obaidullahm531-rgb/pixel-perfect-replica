import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AdminState =
  | { status: "loading" }
  | { status: "signed_out" }
  | { status: "not_admin"; user: User }
  | { status: "admin"; user: User };

/** Tracks the signed-in user and whether they hold the admin role (checked in the database). */
export function useAdminSession(): AdminState {
  const [state, setState] = useState<AdminState>({ status: "loading" });

  useEffect(() => {
    let active = true;
    const resolve = async (user: User | null) => {
      if (!user) {
        if (active) setState({ status: "signed_out" });
        return;
      }
      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (active) setState(data ? { status: "admin", user } : { status: "not_admin", user });
    };
    supabase.auth.getSession().then(({ data }) => resolve(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        setState({ status: "loading" });
        // Defer DB call out of the auth callback.
        setTimeout(() => resolve(session?.user ?? null), 0);
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Uploads a file to the private media bucket and returns a long-lived URL for public display. */
export async function uploadMedia(file: File, folder: string): Promise<{ url: string; path: string }> {
  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "bin";
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("media").upload(path, file, {
    cacheControl: "31536000",
    contentType: file.type || undefined,
    upsert: false,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from("media").createSignedUrl(path, TEN_YEARS);
  if (signErr || !data) throw signErr ?? new Error("Could not create file link");
  return { url: data.signedUrl, path };
}

/** Removes an uploaded file if the URL points at our media bucket. */
export async function deleteMediaByUrl(url: string | null | undefined) {
  if (!url) return;
  const m = url.match(/\/storage\/v1\/object\/(?:sign|public)\/media\/([^?]+)/);
  if (!m?.[1]) return;
  await supabase.storage.from("media").remove([decodeURIComponent(m[1])]);
}
