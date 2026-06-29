/**
 * Central database service layer.
 * All functions accept a Supabase client so they work in both browser and server contexts.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SB = any; // Use 'any' for the client type so Supabase generics don't restrict table ops

import type { HeroContent, AboutContent, ContactContent, FooterContent, Project, Testimonial, Service, ProcessStep } from "@/types";

// ─── site_settings ─────────────────────────────────────────────────────────

export async function getSetting<T>(sb: SB, key: string): Promise<T | null> {
  const { data } = await sb.from("site_settings").select("value").eq("key", key).single();
  return data ? (data.value as unknown as T) : null;
}

export async function setSetting(sb: SB, key: string, value: unknown, userEmail = ""): Promise<void> {
  await sb.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  await saveRevision(sb, key, value, userEmail);
}

// ─── projects ───────────────────────────────────────────────────────────────

export async function getProjects(sb: SB, { publishedOnly = false } = {}): Promise<Project[]> {
  let q = sb.from("projects").select("*").order("sort_order").order("created_at");
  if (publishedOnly) q = q.eq("published", true);
  const { data } = await q;
  return ((data as unknown[]) ?? []).map(dbRowToProject);
}

export async function upsertProject(sb: SB, project: Project & { sort_order?: number }): Promise<Project> {
  const row = projectToDbRow(project);
  const { data, error } = await sb.from("projects").upsert(row).select().single();
  if (error) throw error;
  return dbRowToProject(data);
}

export async function deleteProject(sb: SB, id: string): Promise<void> {
  const { error } = await sb.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function saveAllProjects(sb: SB, projects: Project[], userEmail = ""): Promise<void> {
  await Promise.all(projects.map((p, i) => upsertProject(sb, { ...p, sort_order: i })));
  await saveRevision(sb, "projects", projects, userEmail);
}

// ─── services ───────────────────────────────────────────────────────────────

export async function getServices(sb: SB): Promise<Service[]> {
  const { data } = await sb.from("services").select("*").order("sort_order");
  return ((data as unknown[]) ?? []).map((r: unknown) => {
    const row = r as { id: string; title: string; description: string; icon: string; price: string };
    return { id: row.id, title: row.title, description: row.description, icon: row.icon, price: row.price };
  });
}

export async function saveAllServices(sb: SB, services: Service[], userEmail = ""): Promise<void> {
  const { data: existing } = await sb.from("services").select("id");
  const existingIds  = ((existing as unknown[]) ?? []).map((r: unknown) => (r as { id: string }).id);
  const incomingIds  = services.filter((s) => s.id && !s.id.startsWith("new-")).map((s) => s.id!);
  const toDelete     = existingIds.filter((id: string) => !incomingIds.includes(id));
  if (toDelete.length) await sb.from("services").delete().in("id", toDelete);
  await Promise.all(
    services.map((s, i) =>
      sb.from("services").upsert({
        ...(s.id && !s.id.startsWith("new-") ? { id: s.id } : {}),
        title: s.title, description: s.description, icon: s.icon ?? "camera", price: s.price ?? "", sort_order: i,
      })
    )
  );
  await saveRevision(sb, "services", services, userEmail);
}

// ─── testimonials ────────────────────────────────────────────────────────────

export async function getTestimonials(sb: SB): Promise<Testimonial[]> {
  const { data } = await sb.from("testimonials").select("*").order("sort_order");
  return ((data as unknown[]) ?? []).map((r: unknown) => {
    const row = r as { id: string; name: string; role: string; company: string; text: string; image: string };
    return { id: row.id, name: row.name, role: row.role, company: row.company, text: row.text, image: row.image };
  });
}

export async function saveAllTestimonials(sb: SB, testimonials: Testimonial[], userEmail = ""): Promise<void> {
  const { data: existing } = await sb.from("testimonials").select("id");
  const existingIds = ((existing as unknown[]) ?? []).map((r: unknown) => (r as { id: string }).id);
  const incomingIds = testimonials.filter((t) => t.id && !t.id.startsWith("new-")).map((t) => t.id!);
  const toDelete    = existingIds.filter((id: string) => !incomingIds.includes(id));
  if (toDelete.length) await sb.from("testimonials").delete().in("id", toDelete);
  await Promise.all(
    testimonials.map((t, i) =>
      sb.from("testimonials").upsert({
        ...(t.id && !t.id.startsWith("new-") ? { id: t.id } : {}),
        name: t.name, role: t.role, company: t.company ?? "", text: t.text, image: t.image ?? "", rating: 5, sort_order: i,
      })
    )
  );
  await saveRevision(sb, "testimonials", testimonials, userEmail);
}

// ─── process steps ───────────────────────────────────────────────────────────

export async function getProcessSteps(sb: SB): Promise<ProcessStep[]> {
  const { data } = await sb.from("process_steps").select("*").order("sort_order");
  return ((data as unknown[]) ?? []).map((r: unknown) => {
    const row = r as { id: string; number: string; title: string; description: string };
    return { id: row.id, number: row.number, title: row.title, description: row.description };
  });
}

export async function saveAllProcessSteps(sb: SB, steps: ProcessStep[], userEmail = ""): Promise<void> {
  const { data: existing } = await sb.from("process_steps").select("id");
  const existingIds = ((existing as unknown[]) ?? []).map((r: unknown) => (r as { id: string }).id);
  const incomingIds = steps.filter((s) => s.id && !s.id.startsWith("new-")).map((s) => s.id!);
  const toDelete    = existingIds.filter((id: string) => !incomingIds.includes(id));
  if (toDelete.length) await sb.from("process_steps").delete().in("id", toDelete);
  await Promise.all(
    steps.map((s, i) =>
      sb.from("process_steps").upsert({
        ...(s.id && !s.id.startsWith("new-") ? { id: s.id } : {}),
        number: s.number, title: s.title, description: s.description, sort_order: i,
      })
    )
  );
  await saveRevision(sb, "process", steps, userEmail);
}

// ─── media library ───────────────────────────────────────────────────────────

export interface MediaItem {
  id: string;
  filename: string;
  storage_path: string;
  public_url: string;
  size_bytes: number;
  mime_type: string;
  width: number | null;
  height: number | null;
  alt: string;
  created_at: string;
}

export async function getMediaLibrary(sb: SB): Promise<MediaItem[]> {
  const { data } = await sb.from("media_library").select("*").order("created_at", { ascending: false });
  return ((data as unknown[]) ?? []) as MediaItem[];
}

export async function addMediaItem(sb: SB, item: Omit<MediaItem, "id" | "created_at">): Promise<MediaItem> {
  const { data, error } = await sb.from("media_library").insert(item).select().single();
  if (error) throw error;
  return data as MediaItem;
}

export async function deleteMediaItem(sb: SB, id: string, storagePath: string): Promise<void> {
  await sb.storage.from("media").remove([storagePath]);
  await sb.from("media_library").delete().eq("id", id);
}

export async function updateMediaAlt(sb: SB, id: string, alt: string): Promise<void> {
  await sb.from("media_library").update({ alt }).eq("id", id);
}

// ─── revisions ───────────────────────────────────────────────────────────────

export interface Revision {
  id: string;
  section: string;
  data: unknown;
  created_by: string;
  created_at: string;
}

export async function saveRevision(sb: SB, section: string, data: unknown, createdBy = ""): Promise<void> {
  await sb.from("content_revisions").insert({ section, data, created_by: createdBy });
}

export async function getRevisions(sb: SB, section: string, limit = 20): Promise<Revision[]> {
  const { data } = await sb.from("content_revisions").select("*").eq("section", section).order("created_at", { ascending: false }).limit(limit);
  return ((data as unknown[]) ?? []) as Revision[];
}

// ─── analytics ───────────────────────────────────────────────────────────────

export interface SiteAnalytics {
  projectCount: number;
  publishedCount: number;
  draftCount: number;
  featuredCount: number;
  testimonialCount: number;
  serviceCount: number;
  mediaCount: number;
  storageMb: number;
  lastRevision: string | null;
}

export async function getAnalytics(sb: SB): Promise<SiteAnalytics> {
  const [projects, testimonials, services, media, revisions] = await Promise.all([
    sb.from("projects").select("published, featured"),
    sb.from("testimonials").select("id", { count: "exact", head: true }),
    sb.from("services").select("id", { count: "exact", head: true }),
    sb.from("media_library").select("size_bytes"),
    sb.from("content_revisions").select("created_at").order("created_at", { ascending: false }).limit(1),
  ]);

  const rows = ((projects.data as unknown[]) ?? []) as { published: boolean; featured: boolean }[];
  const mediaRows = ((media.data as unknown[]) ?? []) as { size_bytes: number }[];
  const storageMb = mediaRows.reduce((acc, r) => acc + (r.size_bytes ?? 0), 0) / 1024 / 1024;
  const revRow = (revisions.data as unknown[] | null)?.[0] as { created_at: string } | undefined;

  return {
    projectCount:     rows.length,
    publishedCount:   rows.filter((r) => r.published).length,
    draftCount:       rows.filter((r) => !r.published).length,
    featuredCount:    rows.filter((r) => r.featured).length,
    testimonialCount: testimonials.count ?? 0,
    serviceCount:     services.count ?? 0,
    mediaCount:       mediaRows.length,
    storageMb:        Math.round(storageMb * 10) / 10,
    lastRevision:     revRow?.created_at ?? null,
  };
}

// ─── Type helpers ────────────────────────────────────────────────────────────

function dbRowToProject(r: unknown): Project {
  const row = r as {
    id: string; title: string; slug: string | null; category: string; year: string;
    description: string; cover_image: string; tags: string[]; featured: boolean;
    published: boolean; client: string; location: string; sort_order: number;
  };
  return {
    id: row.id, title: row.title, category: row.category, year: row.year,
    description: row.description, image: row.cover_image, tags: row.tags ?? [],
    featured: row.featured, slug: row.slug ?? "", published: row.published,
    client: row.client ?? "", location: row.location ?? "", sort_order: row.sort_order,
  };
}

function projectToDbRow(p: Project & { sort_order?: number }) {
  return {
    ...(p.id && !p.id.startsWith("new-") ? { id: p.id } : {}),
    title: p.title ?? "", slug: p.slug ?? null, category: p.category ?? "",
    year: p.year ?? "", description: p.description ?? "",
    cover_image: (p as { cover_image?: string }).cover_image ?? p.image ?? "",
    tags: p.tags ?? [], featured: p.featured ?? false, published: p.published ?? true,
    client: p.client ?? "", location: p.location ?? "", shoot_date: null,
    sort_order: p.sort_order ?? 0,
  };
}
