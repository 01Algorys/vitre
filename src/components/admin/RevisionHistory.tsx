"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, RotateCcw, ChevronDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getRevisions, type Revision } from "@/lib/db";

interface Props {
  section: string;
  onRestore: (data: unknown) => void;
}

export default function RevisionHistory({ section, onRestore }: Props) {
  const [open,      setOpen]      = useState(false);
  const [revisions, setRevisions] = useState<Revision[]>([]);
  const [loading,   setLoading]   = useState(false);
  const sb = createClient();

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getRevisions(sb, section).then((r) => { setRevisions(r); setLoading(false); });
  }, [open, section]);

  function fmt(iso: string) {
    return new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="border-t border-white/8 pt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-[#555] hover:text-white text-xs transition-colors duration-200 w-full"
      >
        <Clock size={12} />
        <span>Revision history</span>
        <ChevronDown size={12} className={`ml-auto transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-3 space-y-1.5 max-h-56 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-4">
                  <Loader2 size={16} className="text-[#d4af37] animate-spin" />
                </div>
              ) : revisions.length === 0 ? (
                <p className="text-[#444] text-xs text-center py-4">No revisions yet</p>
              ) : (
                revisions.map((rev) => (
                  <div key={rev.id} className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#0a0a0a] border border-white/6 group">
                    <div>
                      <p className="text-white text-xs">{fmt(rev.created_at)}</p>
                      {rev.created_by && <p className="text-[#444] text-[10px]">{rev.created_by}</p>}
                    </div>
                    <button
                      onClick={() => onRestore(rev.data)}
                      className="flex items-center gap-1 text-[#555] hover:text-[#d4af37] text-[10px] opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <RotateCcw size={10} />
                      Restore
                    </button>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
