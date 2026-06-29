"use client";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  dangerous?: boolean;
}

export default function ConfirmDialog({
  open, title, message, confirmLabel = "Delete", onConfirm, onCancel, dangerous = true,
}: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[10000]"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[10001] w-full max-w-sm bg-[#161616] border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 text-[#444] hover:text-white transition-colors"
            >
              <X size={16} />
            </button>

            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${dangerous ? "bg-red-400/10" : "bg-[#d4af37]/10"}`}>
              <AlertTriangle size={18} className={dangerous ? "text-red-400" : "text-[#d4af37]"} />
            </div>

            <h3 className="text-white font-medium text-base mb-2">{title}</h3>
            <p className="text-[#666] text-sm leading-relaxed mb-6">{message}</p>

            <div className="flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-lg border border-white/10 text-[#888] hover:text-white hover:border-white/25 text-sm transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  dangerous
                    ? "bg-red-500 hover:bg-red-400 text-white"
                    : "bg-[#d4af37] hover:bg-[#e5c84a] text-black"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
