"use client";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import MediaLibrary from "@/components/admin/MediaLibrary";
import { ToastProvider } from "@/components/admin/Toast";

interface Props { userEmail: string }

function Page({ userEmail: _ }: Props) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d0d]/95 backdrop-blur-xl border-b border-white/8 h-14 flex items-center px-5 gap-4">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-[#555] hover:text-white text-sm transition-colors">
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-white/40">·</span>
          <span className="text-white text-sm">Media Library</span>
        </div>
      </div>

      <div className="pt-20 px-6 pb-12 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="font-display text-4xl text-white mb-2">Media Library</h1>
          <p className="text-[#555] text-sm mb-8">All uploaded images stored in Supabase Storage</p>
          <div className="bg-[#0d0d0d] border border-white/8 rounded-2xl p-6" style={{ minHeight: "70vh" }}>
            <MediaLibrary mode="library" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function MediaLibraryPage(props: Props) {
  return (
    <ToastProvider>
      <Page {...props} />
    </ToastProvider>
  );
}
