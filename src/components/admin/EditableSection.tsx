"use client";
import { useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";

interface Props {
  label: string;
  onEdit: () => void;
  children: ReactNode;
}

export default function EditableSection({ label, onEdit, children }: Props) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {/* Hover outline */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 border-2 border-[#d4af37]/40 pointer-events-none z-[100] rounded-sm"
            style={{ boxShadow: "inset 0 0 40px rgba(212,175,55,0.04)" }}
          />
        )}
      </AnimatePresence>

      {/* Edit button */}
      <AnimatePresence>
        {hovered && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={onEdit}
            className="absolute top-4 right-4 z-[101] flex items-center gap-2 bg-[#d4af37] hover:bg-[#e5c84a] text-black rounded-full px-3.5 py-2 text-[11px] font-medium tracking-wide shadow-lg transition-colors duration-200"
          >
            <Pencil size={11} />
            <span>Edit {label}</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
