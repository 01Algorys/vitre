"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ImageIcon, FolderOpen, MessageSquare, Layers, HardDrive, Clock, Star, FileX } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getAnalytics, type SiteAnalytics } from "@/lib/db";

function Stat({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string | number; sub?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111] border border-white/8 rounded-xl p-4 flex items-start gap-3"
    >
      <div className="w-8 h-8 rounded-lg bg-[#d4af37]/10 flex items-center justify-center flex-shrink-0">
        <span className="text-[#d4af37]">{icon}</span>
      </div>
      <div>
        <p className="text-white text-lg font-light leading-none mb-0.5">{value}</p>
        <p className="text-[#555] text-xs">{label}</p>
        {sub && <p className="text-[#333] text-[10px] mt-1">{sub}</p>}
      </div>
    </motion.div>
  );
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<SiteAnalytics | null>(null);
  const sb = createClient();

  useEffect(() => {
    getAnalytics(sb).then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-[#111] border border-white/8 rounded-xl p-4 h-20 animate-pulse" />
        ))}
      </div>
    );
  }

  const lastEdited = stats.lastRevision
    ? new Date(stats.lastRevision).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })
    : "—";

  return (
    <div className="space-y-4">
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#555] mb-3">Portfolio Overview</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={<FolderOpen size={14} />} label="Total projects"   value={stats.projectCount}    sub={`${stats.publishedCount} published`} />
          <Stat icon={<Star size={14} />}       label="Featured"         value={stats.featuredCount}   />
          <Stat icon={<FileX size={14} />}      label="Drafts"           value={stats.draftCount}      />
          <Stat icon={<MessageSquare size={14} />} label="Testimonials"  value={stats.testimonialCount} />
        </div>
      </div>
      <div>
        <p className="text-[10px] tracking-[0.3em] uppercase text-[#555] mb-3">Media & Activity</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat icon={<Layers size={14} />}    label="Services"       value={stats.serviceCount}  />
          <Stat icon={<ImageIcon size={14} />} label="Media files"    value={stats.mediaCount}    />
          <Stat icon={<HardDrive size={14} />} label="Storage used"   value={`${stats.storageMb} MB`} />
          <Stat icon={<Clock size={14} />}     label="Last edited"    value={lastEdited} />
        </div>
      </div>
    </div>
  );
}
