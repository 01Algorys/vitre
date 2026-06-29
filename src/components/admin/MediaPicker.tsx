"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImageIcon, X, Upload, Library } from "lucide-react";
import Image from "next/image";
import MediaLibrary from "@/components/admin/MediaLibrary";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function MediaPicker({ value, onChange, label = "Image" }: Props) {
  const [open, setOpen] = useState(false);
  const [tab,  setTab]  = useState<"library" | "upload">("library");

  const handleSelect = (url: string) => {
    onChange(url);
    setOpen(false);
  };

  return (
    <>
      <div>
        <label className="block text-[10px] tracking-[0.3em] uppercase text-[#555] mb-2">{label}</label>

        {value ? (
          <div className="relative group rounded-lg overflow-hidden border border-white/10 aspect-video bg-[#0a0a0a]">
            <Image src={value} alt="Selected" fill className="object-cover" sizes="400px" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
              >
                <ImageIcon size={11} />
                Change
              </button>
              <button
                type="button"
                onClick={() => onChange("")}
                className="flex items-center gap-1.5 bg-red-500/30 hover:bg-red-500/50 text-white text-xs px-3 py-1.5 rounded-full transition-colors"
              >
                <X size={11} />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full flex flex-col items-center justify-center gap-2 aspect-video border-2 border-dashed border-white/15 hover:border-[#d4af37]/40 rounded-lg text-[#555] hover:text-[#d4af37] transition-all duration-200"
          >
            <ImageIcon size={20} />
            <span className="text-xs">Click to select image</span>
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9200]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-x-4 top-[8vh] bottom-[8vh] md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-[720px] z-[9300] bg-[#111] border border-white/12 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <div className="flex items-center gap-1 bg-[#0a0a0a] rounded-lg p-1">
                  <button
                    onClick={() => setTab("library")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${tab === "library" ? "bg-[#d4af37] text-black font-medium" : "text-[#666] hover:text-white"}`}
                  >
                    <Library size={12} />
                    Media Library
                  </button>
                  <button
                    onClick={() => setTab("upload")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs transition-all ${tab === "upload" ? "bg-[#d4af37] text-black font-medium" : "text-[#666] hover:text-white"}`}
                  >
                    <Upload size={12} />
                    Upload New
                  </button>
                </div>
                <button onClick={() => setOpen(false)} className="text-[#555] hover:text-white transition-colors p-1">
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden p-5">
                <MediaLibrary onSelect={handleSelect} mode="picker" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
