
-- ===== Roles =====
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.admin_exists()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin')
$$;
GRANT EXECUTE ON FUNCTION public.admin_exists() TO anon, authenticated;

-- ===== Profiles =====
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  display_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles self or admin read" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Profiles self update" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- First account ever created becomes the admin; later sign-ups get no role.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== updated_at helper =====
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ===== Site settings (single row) =====
CREATE TABLE public.site_settings (
  id int PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Settings public read" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Settings admin insert" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Settings admin update" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- ===== Content tables =====
CREATE TABLE public.players (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  ign text NOT NULL,
  real_name text,
  role text NOT NULL DEFAULT 'Support',
  role_label text,
  age int,
  country text DEFAULT 'Bangladesh',
  address text,
  ff_uid text,
  photo_url text,
  bio text,
  experience text,
  facebook text, youtube text, instagram text, tiktok text, discord text,
  other_links text,
  featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.managers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL DEFAULT 'Team Manager',
  age int,
  bio text,
  photo_url text,
  email text, phone text, instagram text, facebook text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  organizer text,
  banner_url text,
  start_date date,
  start_time text,
  prize_pool text,
  status text NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming','ongoing','completed')),
  schedule text,
  stream_url text,
  result text,
  description text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_name text NOT NULL,
  position text,
  banner_url text,
  prize_money text,
  achieved_on date,
  team_members text,
  details text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  tier text DEFAULT 'Title Sponsor',
  sponsor_type text NOT NULL DEFAULT 'corporate' CHECK (sponsor_type IN ('corporate','individual')),
  logo_url text,
  description text,
  website text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  category text NOT NULL DEFAULT 'Official Announcements',
  excerpt text,
  content text,
  image_url text,
  published_at timestamptz NOT NULL DEFAULT now(),
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  caption text,
  category text NOT NULL DEFAULT 'Team Photos',
  image_url text,
  video_url text,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text,
  category text DEFAULT 'Match Highlights',
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  label text,
  url text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['players','managers','tournaments','achievements','sponsors','news','gallery','videos','social_links'] LOOP
    EXECUTE format('GRANT SELECT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Public read published" ON public.%I FOR SELECT TO anon, authenticated USING (published = true OR public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "Admin insert" ON public.%I FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "Admin update" ON public.%I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "Admin delete" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE TRIGGER %I BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at()', t || '_touch', t);
  END LOOP;
END $$;

-- ===== Form submissions =====
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  subject text CHECK (subject IS NULL OR char_length(subject) <= 200),
  message text NOT NULL CHECK (char_length(message) BETWEEN 1 AND 5000),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.sponsorship_enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company text NOT NULL CHECK (char_length(company) BETWEEN 1 AND 160),
  contact_person text NOT NULL CHECK (char_length(contact_person) BETWEEN 1 AND 120),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  partnership_type text CHECK (partnership_type IS NULL OR char_length(partnership_type) <= 60),
  details text NOT NULL CHECK (char_length(details) BETWEEN 1 AND 5000),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.join_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL CHECK (char_length(full_name) BETWEEN 1 AND 120),
  ign text NOT NULL CHECK (char_length(ign) BETWEEN 1 AND 60),
  ff_uid text CHECK (ff_uid IS NULL OR char_length(ff_uid) <= 40),
  age int CHECK (age IS NULL OR (age BETWEEN 8 AND 80)),
  country text CHECK (country IS NULL OR char_length(country) <= 80),
  preferred_role text NOT NULL CHECK (char_length(preferred_role) <= 40),
  secondary_role text CHECK (secondary_role IS NULL OR char_length(secondary_role) <= 40),
  facebook text CHECK (facebook IS NULL OR char_length(facebook) <= 300),
  video_link text CHECK (video_link IS NULL OR char_length(video_link) <= 300),
  experience text NOT NULL CHECK (char_length(experience) BETWEEN 1 AND 3000),
  email text NOT NULL CHECK (char_length(email) BETWEEN 3 AND 255),
  phone text CHECK (phone IS NULL OR char_length(phone) <= 40),
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['contact_messages','sponsorship_enquiries','join_applications'] LOOP
    EXECUTE format('GRANT INSERT ON public.%I TO anon', t);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('CREATE POLICY "Anyone can submit" ON public.%I FOR INSERT TO anon, authenticated WITH CHECK (is_read = false)', t);
    EXECUTE format('CREATE POLICY "Admin read" ON public.%I FOR SELECT TO authenticated USING (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "Admin update" ON public.%I FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), ''admin'')) WITH CHECK (public.has_role(auth.uid(), ''admin''))', t);
    EXECUTE format('CREATE POLICY "Admin delete" ON public.%I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''))', t);
  END LOOP;
END $$;

-- ===== Storage policies (bucket "media" created separately) =====
CREATE POLICY "Media public read" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'media');
CREATE POLICY "Media admin insert" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Media admin update" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Media admin delete" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'media' AND public.has_role(auth.uid(), 'admin'));

-- ===== Seed content =====
INSERT INTO public.site_settings (id, data) VALUES (1, '{}'::jsonb);

INSERT INTO public.players (slug, ign, real_name, role, role_label, age, country, photo_url, bio, experience, facebook, youtube, instagram, tiktok, featured, sort_order) VALUES
('inc-silent', 'INC-SILENT', 'ATIK HASAN', 'Rusher', 'Rusher', 16, 'Bangladesh', '/__l5e/assets-v1/2fc819c8-2b19-4d12-88d9-0cde5925cf72/p_silent.jpg', 'fear none', 'Exp gaining', 'https://www.facebook.com/share/1HdjJ4GG5f/', NULL, NULL, 'https://www.tiktok.com/@failureme18', true, 1),
('inc-snapx', 'INC-SNAPX', 'SAYED', 'Sniper', 'Sniper + IGL', 19, 'Bangladesh', '/__l5e/assets-v1/b9b980fa-261c-4729-a5e9-f6df10e62575/p_snapx.jpg', NULL, NULL, 'https://www.facebook.com/share/1E5hR3DJj4/', NULL, 'https://www.instagram.com/sn_apx2532', NULL, true, 2),
('inc-nagi', 'INC-NAGI', NULL, 'Support', 'Support', 19, 'Bangladesh', '/__l5e/assets-v1/adf09998-badb-46d1-bdab-a7215307d586/p_nagi.jpg', NULL, NULL, NULL, NULL, NULL, NULL, true, 3),
('inc-montil', 'INC-MONTIL', NULL, 'Support', 'Support', 18, 'Bangladesh', '/__l5e/assets-v1/a1dd39c9-725b-4465-bf42-49c566e5ca47/p_montil.jpg', NULL, NULL, NULL, NULL, NULL, NULL, true, 4),
('inc-lionx69', 'INC.LIONX69', 'Mainul Hossain Sabab', 'Support', 'Support', 18, 'Bangladesh', '/__l5e/assets-v1/b374607d-cccd-43c7-ab97-902f0b94f107/p_lionx.jpg', NULL, NULL, 'https://www.facebook.com/share/1LchdUBYRv/', 'https://youtube.com/@lionx69xyz', 'https://www.instagram.com/lionwaslost', 'https://www.tiktok.com/@lionzzz', false, 5);

INSERT INTO public.managers (name, position, age, bio, photo_url, email, phone, instagram, sort_order) VALUES
('INC-4SHER', 'Team Manager', 22, 'Rafiq handles day-to-day team operations, scrim scheduling and player communication for the Free Fire roster.', '/__l5e/assets-v1/40982dc1-6814-474f-8b42-350486826293/manager_4sher.jpg', 'alfiu6444@gmail.com', '+880 1676-485489', 'https://www.instagram.com/annhesports', 1);

INSERT INTO public.sponsors (name, tier, sponsor_type, logo_url, description, sort_order) VALUES
('NASIR', 'Title Sponsor', 'individual', '/__l5e/assets-v1/1a99bba8-f34d-4c03-ab9b-cc4a8429e759/sponsor_nasir.jpg', 'Title Sponsor of INCINERATE ESPORTS, supporting our Free Fire roster and the growth of esports in Bangladesh.', 1);

INSERT INTO public.videos (title, video_url, thumbnail_url, category, sort_order) VALUES
('SILENT Highlights GAME PLAY', '/__l5e/assets-v1/36a9e9a0-6f0f-48dc-87fb-4a335514e807/silent_highlight.mp4', '/__l5e/assets-v1/abaa4f16-25bc-4267-b3e3-889abebf2abd/highlight_thumb.jpg', 'Match Highlights', 1);

INSERT INTO public.gallery (caption, category, image_url, video_url, sort_order) VALUES
('SILENT Highlights GAME PLAY', 'Match Highlights', '/__l5e/assets-v1/abaa4f16-25bc-4267-b3e3-889abebf2abd/highlight_thumb.jpg', '/__l5e/assets-v1/36a9e9a0-6f0f-48dc-87fb-4a335514e807/silent_highlight.mp4', 1),
(NULL, 'Event Banners', '/__l5e/assets-v1/ec876a94-67da-40d7-afc6-f4ea091871c7/gallery_banner.jpg', NULL, 2);

INSERT INTO public.social_links (platform, url, sort_order) VALUES
('facebook', 'https://www.facebook.com/share/1Cfcc6VUZo/', 1),
('youtube', 'https://www.youtube.com/@incinerateesports', 2),
('discord', 'https://discord.gg/incinerateesports', 3),
('instagram', 'https://www.instagram.com/incinerateesports', 4),
('tiktok', 'https://www.tiktok.com/@incenarate.esports', 5);
