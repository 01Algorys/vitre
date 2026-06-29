export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// Fully explicit types — no circular self-references to avoid TS resolving them as 'never'

type SiteSettingsRow    = { key: string; value: Json; updated_at: string };
type SiteSettingsInsert = { key: string; value: Json; updated_at?: string };
type SiteSettingsUpdate = { key?: string; value?: Json; updated_at?: string };

type ProjectRow    = { id: string; title: string; slug: string | null; category: string; year: string; description: string; cover_image: string; tags: string[]; featured: boolean; published: boolean; client: string; location: string; shoot_date: string | null; sort_order: number; created_at: string; updated_at: string };
type ProjectInsert = { id?: string; title?: string; slug?: string | null; category?: string; year?: string; description?: string; cover_image?: string; tags?: string[]; featured?: boolean; published?: boolean; client?: string; location?: string; shoot_date?: string | null; sort_order?: number };
type ProjectUpdate = ProjectInsert;

type ProjectImageRow    = { id: string; project_id: string; url: string; alt: string; sort_order: number; created_at: string };
type ProjectImageInsert = { id?: string; project_id: string; url: string; alt?: string; sort_order?: number };
type ProjectImageUpdate = { id?: string; project_id?: string; url?: string; alt?: string; sort_order?: number };

type ServiceRow    = { id: string; title: string; description: string; icon: string; price: string; sort_order: number; created_at: string; updated_at: string };
type ServiceInsert = { id?: string; title?: string; description?: string; icon?: string; price?: string; sort_order?: number };
type ServiceUpdate = ServiceInsert;

type TestimonialRow    = { id: string; name: string; role: string; company: string; text: string; image: string; rating: number; sort_order: number; created_at: string; updated_at: string };
type TestimonialInsert = { id?: string; name?: string; role?: string; company?: string; text?: string; image?: string; rating?: number; sort_order?: number };
type TestimonialUpdate = TestimonialInsert;

type ProcessStepRow    = { id: string; number: string; title: string; description: string; sort_order: number };
type ProcessStepInsert = { id?: string; number?: string; title?: string; description?: string; sort_order?: number };
type ProcessStepUpdate = ProcessStepInsert;

type MediaLibraryRow    = { id: string; filename: string; storage_path: string; public_url: string; size_bytes: number; mime_type: string; width: number | null; height: number | null; alt: string; created_at: string };
type MediaLibraryInsert = { id?: string; filename: string; storage_path: string; public_url: string; size_bytes?: number; mime_type?: string; width?: number | null; height?: number | null; alt?: string };
type MediaLibraryUpdate = { id?: string; filename?: string; storage_path?: string; public_url?: string; size_bytes?: number; mime_type?: string; width?: number | null; height?: number | null; alt?: string };

type ContentRevisionRow    = { id: string; section: string; data: Json; created_by: string; created_at: string };
type ContentRevisionInsert = { id?: string; section: string; data: Json; created_by?: string };
type ContentRevisionUpdate = { section?: string; data?: Json; created_by?: string };

export interface Database {
  public: {
    Tables: {
      site_settings:    { Row: SiteSettingsRow;    Insert: SiteSettingsInsert;    Update: SiteSettingsUpdate };
      projects:          { Row: ProjectRow;          Insert: ProjectInsert;          Update: ProjectUpdate };
      project_images:   { Row: ProjectImageRow;     Insert: ProjectImageInsert;     Update: ProjectImageUpdate };
      services:          { Row: ServiceRow;          Insert: ServiceInsert;          Update: ServiceUpdate };
      testimonials:      { Row: TestimonialRow;      Insert: TestimonialInsert;      Update: TestimonialUpdate };
      process_steps:    { Row: ProcessStepRow;      Insert: ProcessStepInsert;      Update: ProcessStepUpdate };
      media_library:    { Row: MediaLibraryRow;     Insert: MediaLibraryInsert;     Update: MediaLibraryUpdate };
      content_revisions: { Row: ContentRevisionRow;  Insert: ContentRevisionInsert;  Update: ContentRevisionUpdate };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
