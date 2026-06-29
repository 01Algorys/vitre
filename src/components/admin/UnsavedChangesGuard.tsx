"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Save, X } from "lucide-react";

interface Props {
  hasChanges: boolean;
  onSave: () => void;
  onDiscard: () => void;
}

export function useUnsavedChangesWarning(hasChanges: boolean) {
  useEffect(() => {
    if (!hasChanges) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [hasChanges]);
}

export default function UnsavedChangesBar({ hasChanges, onSave, onDiscard }: Props) {
  return (
    <AnimatePresence>
      {hasChanges && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9100] flex items-center gap-3 bg-[#1a1a1a] border border-[#d4af37]/30 rounded-2xl px-5 py-3 shadow-2xl"
        >
          <AlertTriangle size={14} className="text-[#d4af37] flex-shrink-0" />
          <span className="text-white text-sm">Unsaved changes</span>
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={onDiscard}
              className="flex items-center gap-1.5 text-[#666] hover:text-white text-xs px-3 py-1.5 rounded-full border border-white/10 hover:border-white/25 transition-all duration-200"
            >
              <X size={11} />
              Discard
            </button>
            <button
              onClick={onSave}
              className="flex items-center gap-1.5 bg-[#d4af37] hover:bg-[#e5c84a] text-black text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200"
            >
              <Save size={11} />
              Save
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
