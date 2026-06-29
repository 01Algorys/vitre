-- ============================================================
-- Cherif Ouali Portfolio CMS — Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── updated_at trigger ─────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- ─── site_settings ──────────────────────────────────────────
-- Key-value store for hero, about, contact, footer, seo sections
CREATE TABLE IF NOT EXISTS site_settings (
  key         text        PRIMARY KEY,
  value       jsonb       NOT NULL DEFAULT '{}',
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── projects ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS projects (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL DEFAULT '',
  slug         text        UNIQUE,
  category     text        NOT NULL DEFAULT '',
  year         text        NOT NULL DEFAULT '',
  description  text        NOT NULL DEFAULT '',
  cover_image  text        NOT NULL DEFAULT '',
  tags         text[]      NOT NULL DEFAULT '{}',
  featured     boolean     NOT NULL DEFAULT false,
  published    boolean     NOT NULL DEFAULT true,
  client       text        NOT NULL DEFAULT '',
  location     text        NOT NULL DEFAULT '',
  shoot_date   date,
  sort_order   integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── project_images ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS project_images (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id  uuid        NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  url         text        NOT NULL,
  alt         text        NOT NULL DEFAULT '',
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── services ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS services (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text        NOT NULL DEFAULT '',
  description text        NOT NULL DEFAULT '',
  icon        text        NOT NULL DEFAULT 'camera',
  price       text        NOT NULL DEFAULT '',
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── testimonials ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS testimonials (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL DEFAULT '',
  role        text        NOT NULL DEFAULT '',
  company     text        NOT NULL DEFAULT '',
  text        text        NOT NULL DEFAULT '',
  image       text        NOT NULL DEFAULT '',
  rating      integer     NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER testimonials_updated_at BEFORE UPDATE ON testimonials
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── process_steps ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS process_steps (
  id          uuid    PRIMARY KEY DEFAULT gen_random_uuid(),
  number      text    NOT NULL DEFAULT '',
  title       text    NOT NULL DEFAULT '',
  description text    NOT NULL DEFAULT '',
  sort_order  integer NOT NULL DEFAULT 0
);

-- ─── media_library ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media_library (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  filename     text        NOT NULL,
  storage_path text        NOT NULL UNIQUE,
  public_url   text        NOT NULL,
  size_bytes   bigint      NOT NULL DEFAULT 0,
  mime_type    text        NOT NULL DEFAULT '',
  width        integer,
  height       integer,
  alt          text        NOT NULL DEFAULT '',
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- ─── content_revisions ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_revisions (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  section     text        NOT NULL,
  data        jsonb       NOT NULL DEFAULT '{}',
  created_by  text        NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- ─── Row Level Security ──────────────────────────────────────
ALTER TABLE site_settings     ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images     ENABLE ROW LEVEL SECURITY;
ALTER TABLE services           ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials       ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps      ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_library      ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_revisions  ENABLE ROW LEVEL SECURITY;

-- Public reads
CREATE POLICY "public_read_site_settings"    ON site_settings    FOR SELECT USING (true);
CREATE POLICY "public_read_projects"          ON projects          FOR SELECT USING (published = true);
CREATE POLICY "public_read_project_images"   ON project_images   FOR SELECT USING (true);
CREATE POLICY "public_read_services"          ON services          FOR SELECT USING (true);
CREATE POLICY "public_read_testimonials"      ON testimonials      FOR SELECT USING (true);
CREATE POLICY "public_read_process_steps"    ON process_steps    FOR SELECT USING (true);
CREATE POLICY "public_read_media_library"    ON media_library    FOR SELECT USING (true);

-- Authenticated writes (admin users only)
CREATE POLICY "auth_all_site_settings"    ON site_settings    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_projects"          ON projects          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_project_images"   ON project_images   FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_services"          ON services          FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_testimonials"      ON testimonials      FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_process_steps"    ON process_steps    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_media_library"    ON media_library    FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "auth_all_revisions"         ON content_revisions FOR ALL USING (auth.role() = 'authenticated');

-- Admin can read ALL projects (including unpublished)
CREATE POLICY "auth_read_all_projects" ON projects FOR SELECT USING (auth.role() = 'authenticated');

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_projects_sort      ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);
CREATE INDEX IF NOT EXISTS idx_projects_featured  ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_services_sort      ON services(sort_order);
CREATE INDEX IF NOT EXISTS idx_testimonials_sort  ON testimonials(sort_order);
CREATE INDEX IF NOT EXISTS idx_process_sort       ON process_steps(sort_order);
CREATE INDEX IF NOT EXISTS idx_revisions_section  ON content_revisions(section, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_created      ON media_library(created_at DESC);

-- ─── Storage bucket ──────────────────────────────────────────
-- Run this separately or create via Supabase dashboard:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
-- CREATE POLICY "public_read_media" ON storage.objects FOR SELECT USING (bucket_id = 'media');
-- CREATE POLICY "auth_upload_media" ON storage.objects FOR INSERT USING (bucket_id = 'media' AND auth.role() = 'authenticated');
-- CREATE POLICY "auth_delete_media" ON storage.objects FOR DELETE USING (bucket_id = 'media' AND auth.role() = 'authenticated');
