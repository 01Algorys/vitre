"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "reveal" | "done">("loading");

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      const step = Math.random() * 12 + 4;
      current = Math.min(current + step, 100);
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => setPhase("reveal"), 300);
        setTimeout(() => setPhase("done"), 1400);
      }
    }, 75);
    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-[9998] overflow-hidden"
          exit={{ opacity: 1 }}
        >
          {/* Main dark screen */}
          <motion.div
            className="absolute inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center"
            animate={phase === "reveal" ? { y: "-100%" } : { y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1],
              delay: phase === "reveal" ? 0.1 : 0,
            }}
          >
            {/* Centered loader content */}
            <div className="relative flex flex-col items-center">
              {/* Monogram */}
              <motion.div
                className="mb-10 overflow-hidden"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="font-display text-6xl text-white tracking-[0.2em] font-light select-none">
                  Cherif Ouali
                </span>
              </motion.div>

              {/* Progress bar */}
              <div className="w-48 h-px bg-white/10 relative overflow-hidden rounded-full mb-5">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-white/60 to-white"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.08, ease: "linear" }}
                />
              </div>

              {/* Counter */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-baseline gap-1"
              >
                <span className="font-display text-4xl text-white/20 tabular-nums leading-none">
                  {String(Math.round(Math.min(progress, 100))).padStart(3, "0")}
                </span>
                <span className="text-xs text-white/15 tracking-widest">%</span>
              </motion.div>
            </div>

            {/* Bottom label */}
            <motion.div
              className="absolute bottom-10 left-1/2 -translate-x-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <span className="text-[10px] tracking-[0.5em] uppercase text-white/20">
                Cherif Ouali — Visual Artist
              </span>
            </motion.div>

            {/* Corner lines */}
            {[
              "top-8 left-8 border-t border-l",
              "top-8 right-8 border-t border-r",
              "bottom-8 left-8 border-b border-l",
              "bottom-8 right-8 border-b border-r",
            ].map((cls, i) => (
              <motion.div
                key={i}
                className={`absolute w-8 h-8 ${cls} border-white/10`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }}
              />
            ))}
          </motion.div>

          {/* Gold reveal strip that follows behind */}
          <motion.div
            className="absolute inset-0 bg-[#d4af37]/8 pointer-events-none"
            initial={{ y: 0 }}
            animate={phase === "reveal" ? { y: "-100%" } : { y: 0 }}
            transition={{
              duration: 0.9,
              ease: [0.76, 0, 0.24, 1],
              delay: phase === "reveal" ? 0.05 : 0,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
