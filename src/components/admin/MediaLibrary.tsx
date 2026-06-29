"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, X, Search, CheckCircle2, Loader2, Grid3X3, List, Copy } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getMediaLibrary, addMediaItem, deleteMediaItem, type MediaItem } from "@/lib/db";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

interface Props {
  onSelect?: (url: string) => void;
  mode?: "library" | "picker";
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaLibrary({ onSelect, mode = "library" }: Props) {
  const sb = createClient();

  const [items,        setItems]        = useState<MediaItem[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [uploading,    setUploading]    = useState(false);
  const [uploadPct,    setUploadPct]    = useState(0);
  const [query,        setQuery]        = useState("");
  const [view,         setView]         = useState<"grid" | "list">("grid");
  const [selected,     setSelected]     = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [copied,       setCopied]       = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getMediaLibrary(sb);
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const uploadFile = useCallback(async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 30 * 1024 * 1024) { alert("Max file size is 30 MB"); return; }

    setUploading(true);
    setUploadPct(10);

    const ext  = file.name.split(".").pop() ?? "jpg";
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { data: storageData, error } = await sb.storage.from("media").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error || !storageData) { setUploading(false); alert("Upload failed: " + error?.message); return; }

    setUploadPct(70);
    const { data: { publicUrl } } = sb.storage.from("media").getPublicUrl(path);

    const item = await addMediaItem(sb, {
      filename: file.name,
      storage_path: path,
      public_url: publicUrl,
      size_bytes: file.size,
      mime_type: file.type,
      width: null,
      height: null,
      alt: "",
    });

    setUploadPct(100);
    setItems((prev) => [item, ...prev]);
    setUploading(false);
    setUploadPct(0);
  }, [sb]);

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(uploadFile);
  }, [uploadFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDelete = useCallback(async (item: MediaItem) => {
    await deleteMediaItem(sb, item.id, item.storage_path);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    setDeleteTarget(null);
  }, [sb]);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = query
    ? items.filter((i) => i.filename.toLowerCase().includes(query.toLowerCase()) || i.alt.toLowerCase().includes(query.toLowerCase()))
    : items;

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files…"
            className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-8 pr-3 py-2 text-white text-xs placeholder-[#444] outline-none focus:border-[#d4af37]/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1 border border-white/10 rounded-lg p-0.5">
          {([["grid", Grid3X3], ["list", List]] as const).map(([v, Icon]) => (
            <button key={v} onClick={() => setView(v)} className={`p-1.5 rounded transition-colors ${view === v ? "bg-[#d4af37] text-black" : "text-[#555] hover:text-white"}`}>
              <Icon size={13} />
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#e5c84a] text-black rounded-lg px-3 py-2 text-xs font-medium cursor-pointer transition-colors">
          <Upload size={13} />
          Upload
          <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
        </label>
      </div>

      {/* Drop zone */}
      <div
        ref={dropRef}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="relative flex-1 overflow-y-auto"
      >
        {/* Upload progress */}
        <AnimatePresence>
          {uploading && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-3 flex items-center gap-3 bg-[#111] border border-white/10 rounded-lg px-4 py-3"
            >
              <Loader2 size={14} className="text-[#d4af37] animate-spin flex-shrink-0" />
              <div className="flex-1">
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-[#d4af37] rounded-full" animate={{ width: `${uploadPct}%` }} transition={{ duration: 0.3 }} />
                </div>
              </div>
              <span className="text-[#555] text-xs">{uploadPct}%</span>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className={view === "grid" ? "grid grid-cols-3 md:grid-cols-4 gap-3" : "space-y-2"}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`bg-[#111] rounded-lg animate-pulse ${view === "grid" ? "aspect-square" : "h-14"}`} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-[#444]">
            <Upload size={28} className="mb-3 opacity-40" />
            <p className="text-sm">{query ? "No files match your search" : "Drop images here or click Upload"}</p>
          </div>
        ) : view === "grid" ? (
          <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                className={`group relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-200 ${selected === item.id ? "border-[#d4af37]" : "border-transparent hover:border-white/20"}`}
                onClick={() => {
                  setSelected(item.id);
                  if (mode === "picker") onSelect?.(item.public_url);
                }}
              >
                <Image src={item.public_url} alt={item.alt || item.filename} fill className="object-cover" sizes="200px" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyUrl(item.public_url); }}
                    className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    title="Copy URL"
                  >
                    {copied === item.public_url ? <CheckCircle2 size={13} className="text-emerald-400" /> : <Copy size={13} className="text-white" />}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); }}
                    className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={13} className="text-red-400" />
                  </button>
                </div>
                {selected === item.id && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-[#d4af37] flex items-center justify-center">
                    <CheckCircle2 size={12} className="text-black" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer border transition-all duration-150 ${selected === item.id ? "border-[#d4af37]/50 bg-[#d4af37]/5" : "border-transparent hover:bg-white/4"}`}
                onClick={() => { setSelected(item.id); if (mode === "picker") onSelect?.(item.public_url); }}
              >
                <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0 bg-[#111]">
                  <Image src={item.public_url} alt={item.alt || item.filename} fill className="object-cover" sizes="40px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs truncate">{item.filename}</p>
                  <p className="text-[#444] text-[10px]">{formatSize(item.size_bytes)} · {new Date(item.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={(e) => { e.stopPropagation(); copyUrl(item.public_url); }} className="p-1.5 text-[#555] hover:text-white transition-colors">
                    {copied === item.public_url ? <CheckCircle2 size={12} className="text-emerald-400" /> : <Copy size={12} />}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setDeleteTarget(item); }} className="p-1.5 text-[#555] hover:text-red-400 transition-colors">
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Picker confirm button */}
      {mode === "picker" && selected && (
        <div className="mt-4 pt-4 border-t border-white/8">
          <button
            onClick={() => {
              const item = items.find((i) => i.id === selected);
              if (item) onSelect?.(item.public_url);
            }}
            className="w-full bg-[#d4af37] hover:bg-[#e5c84a] text-black text-sm font-medium py-2.5 rounded-lg transition-colors"
          >
            Use selected image
          </button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete image"
        message={`Are you sure you want to delete "${deleteTarget?.filename}"? This cannot be undone.`}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
