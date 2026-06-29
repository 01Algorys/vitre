"use client";
import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  aspect?: string; // e.g. "3/4", "16/9"
}

export default function ImageUpload({ value, onChange, label = "Image", aspect = "3/4" }: Props) {
  const [dragging, setDragging]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setError("");
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Upload failed");
      }
      const { url } = await res.json();
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) upload(file);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const handleRemove = async () => {
    if (value.startsWith("/uploads/")) {
      await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: value }),
      }).catch(() => {});
    }
    onChange("");
  };

  return (
    <div>
      <label className="block text-[10px] tracking-[0.35em] uppercase text-[#555] mb-3">
        {label}
      </label>

      {value ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10 group">
          <div style={{ aspectRatio: aspect.replace("/", "/") }} className="relative w-full">
            <Image src={value} alt="Preview" fill className="object-cover" sizes="400px" />
          </div>
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 w-7 h-7 bg-black/70 hover:bg-red-500 border border-white/20 rounded-full flex items-center justify-center text-white transition-colors duration-200"
          >
            <X size={12} />
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-2 right-2 flex items-center gap-1.5 bg-black/70 hover:bg-[#d4af37] hover:text-black border border-white/20 rounded-full px-3 py-1.5 text-white text-xs transition-all duration-200"
          >
            <Upload size={11} />
            <span>Replace</span>
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
            dragging
              ? "border-[#d4af37]/60 bg-[#d4af37]/5"
              : "border-white/10 hover:border-white/25 bg-white/2"
          }`}
        >
          <AnimatePresence mode="wait">
            {uploading ? (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                <Loader2 size={24} className="text-[#d4af37] animate-spin" />
                <span className="text-[#555] text-xs">Uploading…</span>
              </motion.div>
            ) : (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-2">
                <ImageIcon size={24} className="text-[#333]" />
                <p className="text-[#555] text-xs text-center">
                  Drop an image here or <span className="text-[#d4af37]">click to upload</span>
                </p>
                <p className="text-[#333] text-[10px]">JPG, PNG, WebP — max 20MB</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
