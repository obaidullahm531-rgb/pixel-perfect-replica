import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, type ReactNode } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageField } from "@/components/admin/ImageField";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SEO_PAGES, mergeSettings, settingsToJson, type SiteSettings } from "@/lib/site-settings";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function Text({ label, value, onChange, area, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; area?: boolean; rows?: number }) {
  return (
    <label className="block">
      <span className="form-label">{label}</span>
      {area ? (
        <textarea className="form-input" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="form-input" value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="admin-panel grid gap-4">
      <h2 className="text-lg uppercase">{title}</h2>
      {children}
    </div>
  );
}

const SECTION_LABELS: Record<keyof SiteSettings["sections"], string> = {
  players: "Featured Players",
  managers: "Team Managers",
  tournaments: "Upcoming & Live Tournaments",
  achievements: "Recent Achievements",
  news: "Latest News",
  sponsors: "Sponsors & Partners",
  highlights: "Match Highlights",
};

function SettingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("data").eq("id", 1).maybeSingle();
      if (error) throw error;
      return mergeSettings(data?.data);
    },
  });
  const [s, setS] = useState<SiteSettings | null>(null);
  useEffect(() => {
    if (data) setS(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async (next: SiteSettings) => {
      const { error } = await supabase.from("site_settings").upsert({ id: 1, data: settingsToJson(next) });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Settings saved — the website is updated");
      qc.invalidateQueries({ queryKey: ["admin", "settings"] });
      qc.invalidateQueries({ queryKey: ["public"] });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Save failed"),
  });

  if (isLoading || !s) return <Loader2 className="mx-auto mt-10 h-6 w-6 animate-spin text-primary" />;
  const up = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS({ ...s, [k]: v });

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl uppercase">Site Settings</h1>
          <p className="text-sm text-muted-foreground">Organization info, images, homepage text, footer and page titles.</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={() => save.mutate(s)} disabled={save.isPending}>
          {save.isPending ? <Loader2 className="animate-spin" /> : <Save />} Save Changes
        </button>
      </div>

      <Tabs defaultValue="org">
        <TabsList className="flex h-auto flex-wrap justify-start bg-surface">
          <TabsTrigger value="org">Organization</TabsTrigger>
          <TabsTrigger value="images">Logo & Images</TabsTrigger>
          <TabsTrigger value="home">Homepage</TabsTrigger>
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="footer">Contact & Footer</TabsTrigger>
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        <TabsContent value="org" className="mt-4">
          <Panel title="Organization">
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Name (line 1)" value={s.orgName} onChange={(v) => up("orgName", v)} />
              <Text label="Name (line 2)" value={s.orgSub} onChange={(v) => up("orgSub", v)} />
              <Text label="Slogan" value={s.slogan} onChange={(v) => up("slogan", v)} />
              <Text label="Game" value={s.game} onChange={(v) => up("game", v)} />
              <Text label="Country" value={s.country} onChange={(v) => up("country", v)} />
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="images" className="mt-4">
          <Panel title="Logo & Website Images">
            <ImageField label="Logo" value={s.logoUrl} onChange={(v) => up("logoUrl", v)} folder="site" />
            <ImageField label="Homepage hero background" value={s.heroImageUrl} onChange={(v) => up("heroImageUrl", v)} folder="site" />
            <p className="text-xs text-muted-foreground">Removing an image falls back to the original design image.</p>
          </Panel>
        </TabsContent>

        <TabsContent value="home" className="mt-4 grid gap-4">
          <Panel title="Hero">
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Heading (white)" value={s.heroTitleTop} onChange={(v) => up("heroTitleTop", v)} />
              <Text label="Heading (orange)" value={s.heroTitleBottom} onChange={(v) => up("heroTitleBottom", v)} />
            </div>
            <Text label="Description" area value={s.heroDescription} onChange={(v) => up("heroDescription", v)} />
          </Panel>
          <Panel title="Who We Are">
            <Text label="Main heading" value={s.whoTitle} onChange={(v) => up("whoTitle", v)} />
            <Text label="Paragraph 1" area value={s.whoBody1} onChange={(v) => up("whoBody1", v)} />
            <Text label="Paragraph 2 (mission)" area value={s.whoBody2} onChange={(v) => up("whoBody2", v)} />
            <Text label="Paragraph 3 (vision)" area value={s.whoBody3} onChange={(v) => up("whoBody3", v)} />
          </Panel>
          <Panel title="Value Cards">
            <div className="grid gap-4 sm:grid-cols-2">
              {s.values.map((v, i) => (
                <div key={i} className="grid gap-2 rounded-[10px] border p-3">
                  <Text
                    label={`Card ${i + 1} title`}
                    value={v.title}
                    onChange={(t) => up("values", s.values.map((x, j) => (j === i ? { ...x, title: t } : x)))}
                  />
                  <Text
                    label="Text"
                    area
                    rows={2}
                    value={v.text}
                    onChange={(t) => up("values", s.values.map((x, j) => (j === i ? { ...x, text: t } : x)))}
                  />
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Homepage Sections">
            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(SECTION_LABELS) as (keyof SiteSettings["sections"])[]).map((k) => (
                <label key={k} className="flex items-center gap-3">
                  <Switch checked={s.sections[k]} onCheckedChange={(c) => up("sections", { ...s.sections, [k]: c })} />
                  <span>Show “{SECTION_LABELS[k]}”</span>
                </label>
              ))}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <Panel title="About Page">
            {s.aboutStory.map((p, i) => (
              <Text
                key={i}
                label={`Story paragraph ${i + 1}`}
                area
                value={p}
                onChange={(v) => up("aboutStory", s.aboutStory.map((x, j) => (j === i ? v : x)))}
              />
            ))}
            <Text label="Mission" area value={s.mission} onChange={(v) => up("mission", v)} />
            <Text label="Vision" area value={s.vision} onChange={(v) => up("vision", v)} />
            <Text label="Goals" area value={s.goals} onChange={(v) => up("goals", v)} />
          </Panel>
        </TabsContent>

        <TabsContent value="footer" className="mt-4">
          <Panel title="Contact & Footer">
            <div className="grid gap-4 sm:grid-cols-2">
              <Text label="Business email" value={s.contactEmail} onChange={(v) => up("contactEmail", v)} />
              <Text label="Location" value={s.location} onChange={(v) => up("location", v)} />
            </div>
            <Text label="Location description (Contact page)" value={s.locationLong} onChange={(v) => up("locationLong", v)} />
            <Text label="Footer description" area value={s.footerDescription} onChange={(v) => up("footerDescription", v)} />
            <Text label="Copyright line" value={s.copyright} onChange={(v) => up("copyright", v)} />
          </Panel>
        </TabsContent>

        <TabsContent value="seo" className="mt-4">
          <Panel title="Page Titles & Descriptions (SEO)">
            {SEO_PAGES.map((p) => (
              <div key={p} className="grid gap-2 rounded-[10px] border p-3">
                <p className="stat-label">{p}</p>
                <Text label="Title" value={s.seo[p].title} onChange={(v) => up("seo", { ...s.seo, [p]: { ...s.seo[p], title: v } })} />
                <Text
                  label="Description"
                  area
                  rows={2}
                  value={s.seo[p].description}
                  onChange={(v) => up("seo", { ...s.seo, [p]: { ...s.seo[p], description: v } })}
                />
              </div>
            ))}
          </Panel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
