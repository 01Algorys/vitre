"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, LayoutDashboard, Image, Type, AlignLeft } from "lucide-react";

interface SearchResult {
  section: string;
  label: string;
  preview: string;
  icon: React.ReactNode;
}

interface Props {
  content: Record<string, unknown>;
  onOpenSection: (section: string) => void;
}

function flattenContent(content: Record<string, unknown>): SearchResult[] {
  const results: SearchResult[] = [];

  function walk(obj: unknown, section: string, path: string[] = []) {
    if (typeof obj === "string" && obj.length > 2) {
      results.push({
        section,
        label: path.join(" › "),
        preview: obj.slice(0, 80),
        icon: <Type size={12} />,
      });
    } else if (Array.isArray(obj)) {
      obj.forEach((item, i) => walk(item, section, [...path, `[${i + 1}]`]));
    } else if (obj && typeof obj === "object") {
      Object.entries(obj as Record<string, unknown>).forEach(([k, v]) => walk(v, section, [...path, k]));
    }
  }

  const sectionIcons: Record<string, React.ReactNode> = {
    hero: <LayoutDashboard size={12} />,
    about: <AlignLeft size={12} />,
    projects: <Image size={12} />,
  };

  Object.entries(content).forEach(([section, data]) => {
    if (["hero", "about", "contact", "footer", "seo"].includes(section)) {
      walk(data, section, [section]);
    } else if (Array.isArray(data)) {
      (data as Record<string, unknown>[]).forEach((item, i) => {
        const name = (item.title ?? item.name ?? `Item ${i + 1}`) as string;
        results.push({
          section,
          label: `${section} › ${name}`,
          preview: (item.description ?? item.text ?? name) as string,
          icon: sectionIcons[section] ?? <AlignLeft size={12} />,
        });
      });
    }
  });

  return results;
}

export default function SearchCommand({ content, onOpenSection }: Props) {
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState("");
  const inputRef            = useRef<HTMLInputElement>(null);

  const allResults = flattenContent(content);
  const filtered   = query.length > 1
    ? allResults.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.preview.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : [];

  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        toggle();
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toggle]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
    else setQuery("");
  }, [open]);

  return (
    <>
      <button
        onClick={toggle}
        className="flex items-center gap-2 border border-white/10 hover:border-white/25 rounded-full px-3 py-1.5 text-[#666] hover:text-white text-xs transition-all duration-200"
        title="Search content (⌘K)"
      >
        <Search size={12} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden md:inline text-[9px] border border-white/15 rounded px-1 py-0.5 text-[#555]">⌘K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9500]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[20vh] left-1/2 -translate-x-1/2 w-full max-w-lg z-[9600] bg-[#111] border border-white/12 rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-white/8">
                <Search size={14} className="text-[#555] flex-shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search all content…"
                  className="flex-1 bg-transparent text-white text-sm placeholder-[#444] outline-none"
                />
                <button onClick={() => setOpen(false)}>
                  <X size={14} className="text-[#444] hover:text-white transition-colors" />
                </button>
              </div>

              {query.length > 1 && (
                <div className="max-h-[50vh] overflow-y-auto py-2">
                  {filtered.length === 0 ? (
                    <p className="text-[#444] text-sm text-center py-8">No results for &ldquo;{query}&rdquo;</p>
                  ) : (
                    filtered.map((r, i) => (
                      <button
                        key={i}
                        onClick={() => { onOpenSection(r.section); setOpen(false); }}
                        className="w-full flex items-start gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors duration-150 text-left"
                      >
                        <span className="text-[#d4af37] mt-0.5 flex-shrink-0">{r.icon}</span>
                        <div className="min-w-0">
                          <p className="text-white text-xs font-medium truncate">{r.label}</p>
                          <p className="text-[#555] text-[11px] truncate mt-0.5">{r.preview}</p>
                        </div>
                        <span className="text-[#333] text-[10px] tracking-wide uppercase flex-shrink-0 mt-0.5">{r.section}</span>
                      </button>
                    ))
                  )}
                </div>
              )}

              {!query && (
                <div className="px-4 py-4 grid grid-cols-2 gap-2">
                  {["hero", "about", "projects", "services", "testimonials", "process", "contact", "footer"].map((s) => (
                    <button
                      key={s}
                      onClick={() => { onOpenSection(s); setOpen(false); }}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/8 hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 text-[#888] hover:text-white text-xs transition-all duration-150 capitalize"
                    >
                      <AlignLeft size={11} className="text-[#d4af37]" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
