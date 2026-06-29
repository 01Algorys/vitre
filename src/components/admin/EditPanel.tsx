"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Loader2, Plus, Trash2, Eye, EyeOff } from "lucide-react";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useToast } from "@/components/admin/Toast";
import RichTextEditor from "@/components/admin/RichTextEditor";
import MediaPicker from "@/components/admin/MediaPicker";
import { SortableList } from "@/components/admin/SortableList";
import SEOPanel, { type SEOContent } from "@/components/admin/SEOPanel";
import RevisionHistory from "@/components/admin/RevisionHistory";
import { createClient } from "@/lib/supabase/client";
import {
  setSetting, saveAllProjects, saveAllServices, saveAllTestimonials, saveAllProcessSteps,
} from "@/lib/db";
import type {
  HeroContent, AboutContent, ContactContent, FooterContent,
  Project, Testimonial, Service, ProcessStep,
} from "@/types";

type SectionKey = "hero" | "about" | "contact" | "footer" | "projects" | "testimonials" | "services" | "process" | "seo";

type SectionData =
  | HeroContent | AboutContent | ContactContent | FooterContent | SEOContent
  | Project[] | Testimonial[] | Service[] | ProcessStep[];

interface Props {
  section: SectionKey | null;
  data: SectionData | null;
  userEmail: string;
  onClose: () => void;
  onChange: (section: SectionKey, data: SectionData) => void;
}

// ─── Shared field component ───────────────────────────────────────────────────

function Field({ label, value, onChange, type = "text", rows, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; rows?: number; placeholder?: string;
}) {
  const cls = "w-full bg-[#0a0a0a]/80 border border-white/10 focus:border-[#d4af37]/50 rounded-lg px-3 py-2.5 text-white placeholder-[#333] text-sm outline-none transition-colors duration-200";
  return (
    <div>
      <label className="block text-[10px] tracking-[0.3em] uppercase text-[#555] mb-2">{label}</label>
      {rows
        ? <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-none`} />
        : <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}

// ─── Section editors ──────────────────────────────────────────────────────────

function HeroEditor({ data, onChange }: { data: HeroContent; onChange: (d: HeroContent) => void }) {
  const set = <K extends keyof HeroContent>(k: K, v: HeroContent[K]) => onChange({ ...data, [k]: v });
  const setStat = (i: number, k: "num" | "label", v: string) =>
    onChange({ ...data, stats: data.stats.map((s, idx) => idx === i ? { ...s, [k]: v } : s) });
  return (
    <div className="space-y-5">
      <Field label="Eyebrow text" value={data.eyebrow} onChange={(v) => set("eyebrow", v)} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="First name" value={data.firstName} onChange={(v) => set("firstName", v)} />
        <Field label="Last name"  value={data.lastName}  onChange={(v) => set("lastName", v)} />
      </div>
      <Field label="Tagline" value={data.tagline} onChange={(v) => set("tagline", v)} rows={2} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Primary CTA label" value={data.ctaPrimary.label} onChange={(v) => set("ctaPrimary", { ...data.ctaPrimary, label: v })} />
        <Field label="Primary CTA href"  value={data.ctaPrimary.href}  onChange={(v) => set("ctaPrimary", { ...data.ctaPrimary, href: v })} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Secondary CTA label" value={data.ctaSecondary.label} onChange={(v) => set("ctaSecondary", { ...data.ctaSecondary, label: v })} />
        <Field label="Secondary CTA href"  value={data.ctaSecondary.href}  onChange={(v) => set("ctaSecondary", { ...data.ctaSecondary, href: v })} />
      </div>
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#555] mb-3">Stats</p>
        {data.stats.map((s, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 mb-2">
            <Field label="Number" value={s.num}   onChange={(v) => setStat(i, "num", v)} />
            <Field label="Label"  value={s.label} onChange={(v) => setStat(i, "label", v)} />
          </div>
        ))}
      </div>
      <Field label="Copyright" value={data.copyright} onChange={(v) => set("copyright", v)} />
    </div>
  );
}

function AboutEditor({ data, onChange }: { data: AboutContent; onChange: (d: AboutContent) => void }) {
  const set = <K extends keyof AboutContent>(k: K, v: AboutContent[K]) => onChange({ ...data, [k]: v });
  const setStat = (i: number, k: "value" | "label", v: string) =>
    onChange({ ...data, stats: data.stats.map((s, idx) => idx === i ? { ...s, [k]: v } : s) });
  return (
    <div className="space-y-5">
      <MediaPicker label="Profile Photo" value={data.photo} onChange={(v) => set("photo", v)} />
      <Field label="Heading / Quote" value={data.heading} onChange={(v) => set("heading", v)} rows={3} />
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase text-[#555] mb-2">Bio Paragraph 1</label>
        <RichTextEditor value={data.bio1} onChange={(v) => set("bio1", v)} placeholder="Your story…" />
      </div>
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase text-[#555] mb-2">Bio Paragraph 2</label>
        <RichTextEditor value={data.bio2} onChange={(v) => set("bio2", v)} placeholder="Continue your story…" />
      </div>
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#555] mb-3">Statistics</p>
        {data.stats.map((s, i) => (
          <div key={i} className="grid grid-cols-2 gap-3 mb-2">
            <Field label="Value" value={s.value} onChange={(v) => setStat(i, "value", v)} />
            <Field label="Label" value={s.label} onChange={(v) => setStat(i, "label", v)} />
          </div>
        ))}
      </div>
      <Field label="Location text"       value={data.location}          onChange={(v) => set("location", v)} />
      <Field label="Availability badge"  value={data.availabilityBadge} onChange={(v) => set("availabilityBadge", v)} />
    </div>
  );
}

function ContactEditor({ data, onChange }: { data: ContactContent; onChange: (d: ContactContent) => void }) {
  const set = <K extends keyof ContactContent>(k: K, v: ContactContent[K]) => onChange({ ...data, [k]: v });
  const setSocial = (i: number, k: keyof ContactContent["socials"][0], v: string) =>
    onChange({ ...data, socials: data.socials.map((s, idx) => idx === i ? { ...s, [k]: v } : s) });
  const addSocial    = () => onChange({ ...data, socials: [...data.socials, { type: "", href: "", label: "", sub: "" }] });
  const removeSocial = (i: number) => onChange({ ...data, socials: data.socials.filter((_, idx) => idx !== i) });
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3">
        <Field label="Heading line 1" value={data.headingLine1} onChange={(v) => set("headingLine1", v)} />
        <Field label="Heading line 2" value={data.headingLine2} onChange={(v) => set("headingLine2", v)} />
        <Field label="Heading line 3" value={data.headingLine3} onChange={(v) => set("headingLine3", v)} />
      </div>
      <Field label="Email"         value={data.email}            onChange={(v) => set("email", v)} />
      <Field label="Location"      value={data.location}         onChange={(v) => set("location", v)} />
      <Field label="Location note" value={data.locationNote}     onChange={(v) => set("locationNote", v)} />
      <Field label="Availability text" value={data.availabilityText} onChange={(v) => set("availabilityText", v)} rows={3} />
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#555]">Social Links</p>
          <button onClick={addSocial} className="flex items-center gap-1 text-[#d4af37] text-xs hover:text-[#e5c84a] transition-colors">
            <Plus size={12} /> Add
          </button>
        </div>
        <SortableList
          items={data.socials.map((s, i) => ({ ...s, id: s.href || String(i) }))}
          onChange={(sorted) => onChange({ ...data, socials: sorted.map(({ id: _id, ...s }) => s) })}
          renderItem={(s, i, handle) => (
            <div className="bg-[#111] border border-white/8 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">{handle}<span className="text-[#555] text-xs">Link {i + 1}</span></div>
                <button onClick={() => removeSocial(i)} className="text-[#444] hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
              </div>
              <Field label="Display label" value={s.label} onChange={(v) => setSocial(i, "label", v)} />
              <Field label="URL"           value={s.href}  onChange={(v) => setSocial(i, "href", v)} />
              <Field label="Sub-text"      value={s.sub}   onChange={(v) => setSocial(i, "sub", v)} />
            </div>
          )}
        />
      </div>
    </div>
  );
}

function FooterEditor({ data, onChange }: { data: FooterContent; onChange: (d: FooterContent) => void }) {
  const set = <K extends keyof FooterContent>(k: K, v: FooterContent[K]) => onChange({ ...data, [k]: v });
  const setLink   = (i: number, k: "label" | "href", v: string) =>
    onChange({ ...data, links: data.links.map((l, idx) => idx === i ? { ...l, [k]: v } : l) });
  const setSocial = (i: number, k: "type" | "href" | "label", v: string) =>
    onChange({ ...data, socials: data.socials.map((s, idx) => idx === i ? { ...s, [k]: v } : s) });
  return (
    <div className="space-y-5">
      <Field label="Brand name"   value={data.name}        onChange={(v) => set("name", v)} />
      <Field label="Tagline"      value={data.tagline}     onChange={(v) => set("tagline", v)} />
      <Field label="Copyright"    value={data.copyright}   onChange={(v) => set("copyright", v)} />
      <Field label="Location tag" value={data.locationTag} onChange={(v) => set("locationTag", v)} />
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#555] mb-3">Nav Links</p>
        {data.links.map((l, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 mb-2">
            <Field label="Label" value={l.label} onChange={(v) => setLink(i, "label", v)} />
            <Field label="Href"  value={l.href}  onChange={(v) => setLink(i, "href", v)} />
          </div>
        ))}
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#555]">Social Icons</p>
          <button onClick={() => onChange({ ...data, socials: [...data.socials, { type: "", href: "", label: "" }] })}
            className="flex items-center gap-1 text-[#d4af37] text-xs hover:text-[#e5c84a] transition-colors"><Plus size={12} /> Add</button>
        </div>
        {data.socials.map((s, i) => (
          <div key={i} className="grid grid-cols-3 gap-2 mb-2 items-end">
            <Field label="Label" value={s.label} onChange={(v) => setSocial(i, "label", v)} />
            <Field label="URL"   value={s.href}  onChange={(v) => setSocial(i, "href", v)} />
            <button onClick={() => onChange({ ...data, socials: data.socials.filter((_, idx) => idx !== i) })}
              className="h-9 flex items-center justify-center text-[#444] hover:text-red-400 border border-white/8 rounded-lg transition-colors">
              <Trash2 size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsEditor({ data, onChange }: { data: Project[]; onChange: (d: Project[]) => void }) {
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [expanded,  setExpanded]  = useState<string | null>(data[0]?.id ?? null);

  const setField = (id: string, k: keyof Project, v: unknown) =>
    onChange(data.map((p) => p.id === id ? { ...p, [k]: v } : p));

  const addProject = () => {
    const id = `new-${Date.now()}`;
    const proj: Project = { id, title: "New Project", category: "", year: new Date().getFullYear().toString(), description: "", image: "", tags: [], featured: false, published: true };
    onChange([...data, proj]);
    setExpanded(id);
  };

  return (
    <div className="space-y-2">
      <SortableList
        items={data}
        onChange={onChange}
        renderItem={(p, i, handle) => (
          <div className="border border-white/8 rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 p-3 bg-[#111]">
              {handle}
              <button
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                className="flex-1 text-left text-sm text-white truncate hover:text-[#d4af37] transition-colors"
              >
                {p.title || "Untitled"}
              </button>
              <div className="flex items-center gap-1 flex-shrink-0">
                <span className={`text-[9px] px-2 py-0.5 rounded-full border ${p.published !== false ? "border-emerald-400/30 text-emerald-400" : "border-[#555] text-[#555]"}`}>
                  {p.published !== false ? "live" : "draft"}
                </span>
                {p.featured && <span className="text-[9px] px-2 py-0.5 rounded-full border border-[#d4af37]/40 text-[#d4af37]">featured</span>}
                <button onClick={() => { setDeleteIdx(i); }} className="p-1 text-[#444] hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
              </div>
            </div>
            <AnimatePresence>
              {expanded === p.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="p-4 space-y-4 border-t border-white/8">
                    <MediaPicker label="Cover Image" value={p.image} onChange={(v) => setField(p.id, "image", v)} />
                    <Field label="Title"    value={p.title}    onChange={(v) => setField(p.id, "title", v)} />
                    <Field label="Slug (URL)" value={p.slug ?? ""} onChange={(v) => setField(p.id, "slug", v)} placeholder="my-project-slug" />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Category" value={p.category} onChange={(v) => setField(p.id, "category", v)} />
                      <Field label="Year"     value={p.year}     onChange={(v) => setField(p.id, "year", v)} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Client"   value={p.client   ?? ""} onChange={(v) => setField(p.id, "client", v)} />
                      <Field label="Location" value={p.location ?? ""} onChange={(v) => setField(p.id, "location", v)} />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-[0.3em] uppercase text-[#555] mb-2">Description</label>
                      <RichTextEditor value={p.description} onChange={(v) => setField(p.id, "description", v)} placeholder="Project description…" />
                    </div>
                    <Field label="Tags (comma-separated)" value={p.tags.join(", ")} onChange={(v) => setField(p.id, "tags", v.split(",").map((t) => t.trim()).filter(Boolean))} />
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={!!p.featured} onChange={(e) => setField(p.id, "featured", e.target.checked)} className="accent-[#d4af37]" />
                        <span className="text-[#888] text-xs">Featured</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={p.published !== false} onChange={(e) => setField(p.id, "published", e.target.checked)} className="accent-[#d4af37]" />
                        <span className="text-[#888] text-xs">Published</span>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      />

      <button onClick={addProject} className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-[#d4af37]/40 rounded-xl py-3 text-[#555] hover:text-[#d4af37] text-sm transition-all duration-200">
        <Plus size={14} /> Add Project
      </button>

      <ConfirmDialog
        open={deleteIdx !== null}
        title="Delete Project"
        message={`Delete "${data[deleteIdx ?? 0]?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => { if (deleteIdx !== null) { onChange(data.filter((_, idx) => idx !== deleteIdx)); setDeleteIdx(null); } }}
        onCancel={() => setDeleteIdx(null)}
      />
    </div>
  );
}

function ServicesEditor({ data, onChange }: { data: Service[]; onChange: (d: Service[]) => void }) {
  const setField = (id: string, k: keyof Service, v: string) =>
    onChange(data.map((s) => s.id === id ? { ...s, [k]: v } : s));
  const add = () => onChange([...data, { id: `new-${Date.now()}`, title: "New Service", description: "", icon: "camera", price: "" }]);

  return (
    <div className="space-y-2">
      <SortableList
        items={data}
        onChange={onChange}
        renderItem={(s, _i, handle) => (
          <div className="bg-[#111] border border-white/8 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              {handle}
              <span className="text-white text-sm font-medium flex-1 truncate">{s.title || "Service"}</span>
              <button onClick={() => onChange(data.filter((x) => x.id !== s.id))} className="text-[#444] hover:text-red-400 transition-colors p-1"><Trash2 size={13} /></button>
            </div>
            <Field label="Title"       value={s.title}       onChange={(v) => setField(s.id, "title", v)} />
            <div>
              <label className="block text-[10px] tracking-[0.3em] uppercase text-[#555] mb-2">Description</label>
              <RichTextEditor value={s.description} onChange={(v) => setField(s.id, "description", v)} placeholder="Describe this service…" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Icon key" value={s.icon ?? ""} onChange={(v) => setField(s.id, "icon", v)} placeholder="camera" />
              <Field label="Price"    value={s.price ?? ""} onChange={(v) => setField(s.id, "price", v)} placeholder="From €800" />
            </div>
          </div>
        )}
      />
      <button onClick={add} className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-[#d4af37]/40 rounded-xl py-3 text-[#555] hover:text-[#d4af37] text-sm transition-all duration-200">
        <Plus size={14} /> Add Service
      </button>
    </div>
  );
}

function TestimonialsEditor({ data, onChange }: { data: Testimonial[]; onChange: (d: Testimonial[]) => void }) {
  const setField = (id: string, k: keyof Testimonial, v: unknown) =>
    onChange(data.map((t) => t.id === id ? { ...t, [k]: v } : t));
  const add = () => onChange([...data, { id: `new-${Date.now()}`, name: "New Testimonial", role: "", company: "", text: "" }]);

  return (
    <div className="space-y-2">
      <SortableList
        items={data}
        onChange={onChange}
        renderItem={(t, _i, handle) => (
          <div className="bg-[#111] border border-white/8 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              {handle}
              <span className="text-white text-sm font-medium flex-1 truncate">{t.name}</span>
              <button onClick={() => onChange(data.filter((x) => x.id !== t.id))} className="text-[#444] hover:text-red-400 transition-colors p-1"><Trash2 size={13} /></button>
            </div>
            <MediaPicker label="Avatar" value={t.image ?? ""} onChange={(v) => setField(t.id, "image", v)} />
            <Field label="Name"    value={t.name}    onChange={(v) => setField(t.id, "name", v)} />
            <Field label="Role"    value={t.role}    onChange={(v) => setField(t.id, "role", v)} />
            <Field label="Company" value={t.company} onChange={(v) => setField(t.id, "company", v)} />
            <Field label="Quote"   value={t.text}    onChange={(v) => setField(t.id, "text", v)} rows={3} />
          </div>
        )}
      />
      <button onClick={add} className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-[#d4af37]/40 rounded-xl py-3 text-[#555] hover:text-[#d4af37] text-sm transition-all duration-200">
        <Plus size={14} /> Add Testimonial
      </button>
    </div>
  );
}

function ProcessEditor({ data, onChange }: { data: ProcessStep[]; onChange: (d: ProcessStep[]) => void }) {
  const setField = (id: string, k: keyof ProcessStep, v: string) =>
    onChange(data.map((s) => s.id === id ? { ...s, [k]: v } : s));
  const add = () => {
    const n = data.length + 1;
    onChange([...data, { id: `new-${Date.now()}`, number: String(n).padStart(2, "0"), title: "New Step", description: "" }]);
  };

  return (
    <div className="space-y-2">
      <SortableList
        items={data}
        onChange={onChange}
        renderItem={(s, _i, handle) => (
          <div className="bg-[#111] border border-white/8 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              {handle}
              <span className="text-[#d4af37] text-sm font-display">{s.number}</span>
              <span className="text-white text-sm flex-1 truncate">{s.title}</span>
              <button onClick={() => onChange(data.filter((x) => x.id !== s.id))} className="text-[#444] hover:text-red-400 transition-colors p-1"><Trash2 size={13} /></button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Number" value={s.number} onChange={(v) => setField(s.id, "number", v)} placeholder="01" />
              <Field label="Title"  value={s.title}  onChange={(v) => setField(s.id, "title", v)} />
            </div>
            <Field label="Description" value={s.description} onChange={(v) => setField(s.id, "description", v)} rows={3} />
          </div>
        )}
      />
      <button onClick={add} className="w-full flex items-center justify-center gap-2 border border-dashed border-white/15 hover:border-[#d4af37]/40 rounded-xl py-3 text-[#555] hover:text-[#d4af37] text-sm transition-all duration-200">
        <Plus size={14} /> Add Step
      </button>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<SectionKey, string> = {
  hero: "Hero", about: "About", contact: "Contact", footer: "Footer",
  projects: "Projects", testimonials: "Testimonials", services: "Services", process: "Process", seo: "SEO",
};

export default function EditPanel({ section, data, userEmail, onClose, onChange }: Props) {
  const { toast }          = useToast();
  const [localData, setLocalData] = useState<SectionData | null>(data);
  const [saving,    setSaving]    = useState(false);
  const [showRaw,   setShowRaw]   = useState(false);
  const sb                 = createClient();

  // Sync when section or data changes from outside
  useEffect(() => { setLocalData(data); }, [section, data]);

  // Live preview — push every change up to parent immediately
  const handleChange = useCallback((newData: SectionData) => {
    setLocalData(newData);
    if (section) onChange(section, newData);
  }, [section, onChange]);

  // ⌘S save shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s" && section) { e.preventDefault(); handleSave(); }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [section, localData]);

  const handleSave = useCallback(async () => {
    if (!section || !localData) return;
    setSaving(true);
    try {
      if (["hero", "about", "contact", "footer", "seo"].includes(section)) {
        await setSetting(sb, section, localData, userEmail);
      } else if (section === "projects") {
        await saveAllProjects(sb, localData as Project[], userEmail);
      } else if (section === "services") {
        await saveAllServices(sb, localData as Service[], userEmail);
      } else if (section === "testimonials") {
        await saveAllTestimonials(sb, localData as Testimonial[], userEmail);
      } else if (section === "process") {
        await saveAllProcessSteps(sb, localData as ProcessStep[], userEmail);
      }
      toast(`${SECTION_LABELS[section]} saved`, "success");
    } catch (err) {
      toast("Save failed — " + (err instanceof Error ? err.message : "unknown error"), "error");
    } finally {
      setSaving(false);
    }
  }, [section, localData, userEmail, sb, toast]);

  const renderEditor = () => {
    if (!section || !localData) return null;
    switch (section) {
      case "hero":         return <HeroEditor         data={localData as HeroContent}   onChange={handleChange} />;
      case "about":        return <AboutEditor        data={localData as AboutContent}  onChange={handleChange} />;
      case "contact":      return <ContactEditor      data={localData as ContactContent} onChange={handleChange} />;
      case "footer":       return <FooterEditor       data={localData as FooterContent}  onChange={handleChange} />;
      case "projects":     return <ProjectsEditor     data={localData as Project[]}      onChange={handleChange} />;
      case "testimonials": return <TestimonialsEditor data={localData as Testimonial[]}  onChange={handleChange} />;
      case "services":     return <ServicesEditor     data={localData as Service[]}      onChange={handleChange} />;
      case "process":      return <ProcessEditor      data={localData as ProcessStep[]}  onChange={handleChange} />;
      case "seo":          return <SEOPanel           data={localData as SEOContent}     onChange={handleChange} />;
    }
  };

  return (
    <AnimatePresence>
      {section && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-[8900]"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed top-14 right-0 bottom-0 w-full md:w-[440px] lg:w-[480px] bg-[#0d0d0d] border-l border-white/8 z-[9000] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 flex-shrink-0">
              <div>
                <h2 className="text-white text-sm font-medium">{section ? SECTION_LABELS[section] : ""}</h2>
                <p className="text-[#444] text-[10px] tracking-wide">⌘S to save · Esc to close</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowRaw(!showRaw)}
                  title="Toggle raw JSON"
                  className="p-1.5 text-[#444] hover:text-white transition-colors"
                >
                  {showRaw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#e5c84a] disabled:opacity-50 text-black rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all duration-200"
                >
                  {saving ? <Loader2 size={12} className="animate-spin" /> : <Save size={12} />}
                  Save
                </button>
                <button onClick={onClose} className="p-1.5 text-[#555] hover:text-white transition-colors ml-1">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {showRaw ? (
                <div>
                  <pre className="bg-[#0a0a0a] border border-white/8 rounded-lg p-4 text-[10px] text-[#888] overflow-auto max-h-[60vh] leading-relaxed">
                    {JSON.stringify(localData, null, 2)}
                  </pre>
                </div>
              ) : (
                renderEditor()
              )}

              {/* Revision history */}
              {section && (
                <div className="mt-8">
                  <RevisionHistory
                    section={section}
                    onRestore={(data) => { handleChange(data as SectionData); toast("Revision restored — save to apply", "info"); }}
                  />
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
