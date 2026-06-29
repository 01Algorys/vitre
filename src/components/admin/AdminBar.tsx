"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { LogOut, Eye, BarChart2, Image as ImageIcon, Globe, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Toast";
import SearchCommand from "@/components/admin/SearchCommand";
import { createClient } from "@/lib/supabase/client";

interface Props {
  content?: Record<string, unknown>;
  onOpenSection?: (section: string) => void;
  onOpenAnalytics?: () => void;
}

export default function AdminBar({ content = {}, onOpenSection, onOpenAnalytics }: Props) {
  const router     = useRouter();
  const { toast }  = useToast();
  const sb         = createClient();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await sb.auth.signOut();
    router.push("/admin");
  };

  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[9000] bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-white/8 h-14 flex items-center px-5 gap-3"
    >
      {/* Brand */}
      <div className="flex items-center gap-3 mr-auto">
        <div className="w-7 h-7 rounded-full border border-[#d4af37]/40 flex items-center justify-center flex-shrink-0">
          <span className="font-display text-xs text-[#d4af37]">CO</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-light hidden sm:block">Admin</span>
          <span className="text-[#333] hidden sm:block">·</span>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[#555] text-xs tracking-wide hidden md:block">Live Editor</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <SearchCommand content={content} onOpenSection={(s) => onOpenSection?.(s)} />

      {/* Analytics */}
      <button
        onClick={onOpenAnalytics}
        title="Analytics"
        className="flex items-center gap-1.5 border border-white/10 hover:border-white/25 rounded-full px-3 py-1.5 text-[#666] hover:text-white text-xs transition-all duration-200"
      >
        <BarChart2 size={12} />
        <span className="hidden sm:inline">Analytics</span>
      </button>

      {/* Media library */}
      <a
        href="/admin/media"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 border border-white/10 hover:border-white/25 rounded-full px-3 py-1.5 text-[#666] hover:text-white text-xs transition-all duration-200"
        title="Media library"
      >
        <ImageIcon size={12} />
        <span className="hidden sm:inline">Media</span>
      </a>

      {/* SEO */}
      <button
        onClick={() => onOpenSection?.("seo")}
        className="flex items-center gap-1.5 border border-white/10 hover:border-white/25 rounded-full px-3 py-1.5 text-[#666] hover:text-white text-xs transition-all duration-200"
        title="SEO settings"
      >
        <Globe size={12} />
        <span className="hidden md:inline">SEO</span>
      </button>

      {/* Preview */}
      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 border border-white/10 hover:border-white/25 rounded-full px-3 py-1.5 text-[#666] hover:text-white text-xs tracking-wide transition-all duration-200"
      >
        <Eye size={12} />
        <span className="hidden sm:inline">Preview</span>
      </a>

      {/* Logout */}
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="flex items-center gap-1.5 text-[#555] hover:text-red-400 text-xs tracking-wide transition-colors duration-200"
      >
        {loggingOut ? <Loader2 size={12} className="animate-spin" /> : <LogOut size={12} />}
        <span className="hidden sm:inline">Logout</span>
      </button>
    </motion.div>
  );
}
