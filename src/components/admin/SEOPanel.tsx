"use client";
import { Globe, Tag, Share2, FileSearch } from "lucide-react";

export interface SEOContent {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  keywords: string;
  canonical: string;
  robots: string;
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  max?: number;
}

function Field({ label, value, onChange, rows, placeholder, max }: FieldProps) {
  const cls = "w-full bg-[#0a0a0a]/80 border border-white/10 focus:border-[#d4af37]/50 rounded-lg px-3 py-2.5 text-white placeholder-[#333] text-sm outline-none transition-colors duration-200";
  const count = value.length;
  const over = max && count > max;
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block text-[10px] tracking-[0.3em] uppercase text-[#555]">{label}</label>
        {max && <span className={`text-[10px] ${over ? "text-red-400" : "text-[#444]"}`}>{count}/{max}</span>}
      </div>
      {rows ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${cls} resize-none`} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

interface Props {
  data: SEOContent;
  onChange: (d: SEOContent) => void;
}

const EMPTY: SEOContent = { title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", keywords: "", canonical: "", robots: "index, follow" };

export default function SEOPanel({ data = EMPTY, onChange }: Props) {
  const set = <K extends keyof SEOContent>(k: K, v: string) => onChange({ ...data, [k]: v });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileSearch size={14} className="text-[#d4af37]" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#555]">Search Engine</p>
        </div>
        <div className="space-y-4">
          <Field label="Page Title"          value={data.title}       onChange={(v) => set("title", v)}       placeholder="Cherif Ouali — Photographer" max={60} />
          <Field label="Meta Description"    value={data.description} onChange={(v) => set("description", v)} placeholder="Wedding & portrait photography…" rows={3} max={160} />
          <Field label="Keywords (comma-separated)" value={data.keywords}    onChange={(v) => set("keywords", v)}    placeholder="photographer, wedding, Tunisia, Paris" />
        </div>
      </div>

      <div className="border-t border-white/8 pt-5">
        <div className="flex items-center gap-2 mb-4">
          <Share2 size={14} className="text-[#d4af37]" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#555]">Open Graph (Social Sharing)</p>
        </div>
        <div className="space-y-4">
          <Field label="OG Title"       value={data.ogTitle}       onChange={(v) => set("ogTitle", v)}       placeholder={data.title} max={60} />
          <Field label="OG Description" value={data.ogDescription} onChange={(v) => set("ogDescription", v)} placeholder={data.description} rows={2} max={200} />
          <Field label="OG Image URL"   value={data.ogImage}       onChange={(v) => set("ogImage", v)}       placeholder="https://…/og-image.jpg" />
        </div>
      </div>

      <div className="border-t border-white/8 pt-5">
        <div className="flex items-center gap-2 mb-4">
          <Globe size={14} className="text-[#d4af37]" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#555]">Technical</p>
        </div>
        <div className="space-y-4">
          <Field label="Canonical URL" value={data.canonical} onChange={(v) => set("canonical", v)} placeholder="https://cherifouali.com" />
          <div>
            <label className="block text-[10px] tracking-[0.3em] uppercase text-[#555] mb-1.5">Robots</label>
            <select
              value={data.robots}
              onChange={(e) => set("robots", e.target.value)}
              className="w-full bg-[#0a0a0a]/80 border border-white/10 focus:border-[#d4af37]/50 rounded-lg px-3 py-2.5 text-white text-sm outline-none transition-colors duration-200"
            >
              <option value="index, follow">index, follow (default)</option>
              <option value="noindex, follow">noindex, follow</option>
              <option value="index, nofollow">index, nofollow</option>
              <option value="noindex, nofollow">noindex, nofollow (hide from search)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview */}
      {(data.title || data.description) && (
        <div className="border-t border-white/8 pt-5">
          <div className="flex items-center gap-2 mb-3">
            <Tag size={14} className="text-[#d4af37]" />
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#555]">Search Preview</p>
          </div>
          <div className="bg-white rounded-lg p-3 space-y-0.5">
            <p className="text-[#1a0dab] text-sm font-medium leading-snug line-clamp-1">{data.title || "Page title"}</p>
            <p className="text-[#006621] text-[11px]">{data.canonical || "https://cherifouali.com"}</p>
            <p className="text-[#545454] text-xs leading-relaxed line-clamp-2">{data.description || "Page description will appear here…"}</p>
          </div>
        </div>
      )}
    </div>
  );
}
