-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
CREATE TABLE public.profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name   TEXT,
  email       TEXT UNIQUE NOT NULL,
  role        TEXT NOT NULL DEFAULT 'field_agent'
                CHECK (role IN ('admin', 'field_agent')),
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FIELDS ──────────────────────────────────────────────────────────────────
CREATE TABLE public.fields (
  id                UUID    DEFAULT uuid_generate_v4() PRIMARY KEY,
  name              TEXT    NOT NULL,
  crop_type         TEXT    NOT NULL,
  planting_date     DATE    NOT NULL,
  current_stage     TEXT    NOT NULL DEFAULT 'planted'
                      CHECK (current_stage IN ('planted','growing','ready','harvested')),
  location          TEXT,
  area_hectares     NUMERIC(10,2),
  assigned_agent_id UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_by        UUID    REFERENCES public.profiles(id) ON DELETE SET NULL,
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ─── FIELD UPDATES ───────────────────────────────────────────────────────────
CREATE TABLE public.field_updates (
  id         UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  field_id   UUID REFERENCES public.fields(id) ON DELETE CASCADE NOT NULL,
  agent_id   UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  stage      TEXT NOT NULL CHECK (stage IN ('planted','growing','ready','harvested')),
  notes      TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fields       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_updates ENABLE ROW LEVEL SECURITY;

-- Profiles: everyone can read; users update their own
CREATE POLICY "profiles_select"     ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_admin_update" ON public.profiles FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Fields: admins full access; agents read + update their assigned fields
CREATE POLICY "fields_admin_all" ON public.fields FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "fields_agent_select" ON public.fields FOR SELECT TO authenticated
  USING (assigned_agent_id = auth.uid());

CREATE POLICY "fields_agent_update" ON public.fields FOR UPDATE TO authenticated
  USING (assigned_agent_id = auth.uid()) WITH CHECK (assigned_agent_id = auth.uid());

-- Field updates: admins all; agents insert/select on their fields
CREATE POLICY "updates_admin_all" ON public.field_updates FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "updates_agent_select" ON public.field_updates FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.fields WHERE id = field_id AND assigned_agent_id = auth.uid()));

CREATE POLICY "updates_agent_insert" ON public.field_updates FOR INSERT TO authenticated
  WITH CHECK (
    agent_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.fields WHERE id = field_id AND assigned_agent_id = auth.uid())
  );

-- ─── TRIGGERS ────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_fields_updated_at
  BEFORE UPDATE ON public.fields
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();