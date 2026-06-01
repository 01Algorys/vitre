"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import MagneticButton from "@/components/ui/MagneticButton";
import { ArrowDown } from "lucide-react";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => null,
});

const STATS = [
  { num: "180+", label: "Projects" },
  { num: "12",   label: "Awards" },
  { num: "8",    label: "Years" },
];

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const opacity   = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const scale     = useTransform(scrollYProgress, [0, 0.55], [1, 0.94]);
  const textY     = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const bgScale   = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* 3D Background */}
      <motion.div className="absolute inset-0 z-0" style={{ opacity, scale: bgScale }}>
        <HeroScene />
        {/* Gradient vignette layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/30 via-transparent to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/70 via-transparent to-[#0a0a0a]/70" />
        <div className="absolute inset-0 bg-[#0a0a0a]/15" />
      </motion.div>

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16"
        style={{ y: textY, opacity, scale }}
      >
        <div className="flex flex-col items-center text-center">

          {/* Eyebrow */}
          <motion.div
            className="flex items-center gap-4 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.0, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              className="h-px bg-gradient-to-r from-transparent to-[#d4af37]"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 1, delay: 2.2 }}
            />
            <span className="text-[11px] tracking-[0.5em] uppercase text-[#d4af37] font-light">
              Photographer — Tunisia · Paris
            </span>
            <motion.div
              className="h-px bg-gradient-to-l from-transparent to-[#d4af37]"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 1, delay: 2.2 }}
            />
          </motion.div>

          {/* Main heading */}
          <h1 className="font-display leading-[0.88] tracking-tight text-white mb-8 select-none">
            {/* "Cherif" */}
            <span className="block overflow-hidden">
              <motion.span
                className="block text-[clamp(4rem,12vw,10.5rem)]"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 2.1 }}
              >
                Cherif
              </motion.span>
            </span>

            {/* "Ouali" with gradient */}
            <span className="block overflow-hidden">
              <motion.span
                className="block text-[clamp(4rem,12vw,10.5rem)] text-gradient italic"
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 2.25 }}
              >
                Ouali
              </motion.span>
            </span>
          </h1>

          {/* Tagline */}
          <motion.p
            className="text-[#888] text-base md:text-lg font-light tracking-wide max-w-md mx-auto mb-14 leading-relaxed"
            initial={{ opacity: 0, y: 16, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1.2, delay: 2.55, ease: "easeOut" }}
          >
            When photography is not all about just taking photos,
            but telling a story.
          </motion.p>

          {/* CTA row */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 2.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <MagneticButton
              href="#work"
              className="relative overflow-hidden bg-white text-black px-9 py-3.5 text-[11px] tracking-[0.28em] uppercase font-medium rounded-full hover:bg-[#e5e5e5] transition-colors duration-300"
            >
              Discover My Work
            </MagneticButton>

            <MagneticButton
              href="#contact"
              className="border border-white/20 hover:border-white/50 px-9 py-3.5 text-[11px] tracking-[0.28em] uppercase text-[#999] hover:text-white transition-all duration-300 rounded-full"
            >
              Book a Session
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator — centre bottom */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.3, duration: 1 }}
      >
        <span className="text-[9px] tracking-[0.5em] uppercase text-[#444]">Scroll</span>
        <motion.div
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={13} className="text-[#444]" />
        </motion.div>
      </motion.div>

      {/* Stats — right side */}
      <motion.div
        className="absolute bottom-10 right-8 lg:right-14 z-10 hidden lg:flex flex-col items-end gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.1, duration: 0.9 }}
      >
        {STATS.map(({ num, label }) => (
          <div key={label} className="flex items-baseline gap-2">
            <span className="font-display text-2xl text-white">{num}</span>
            <span className="text-[9px] text-[#444] tracking-[0.3em] uppercase">{label}</span>
          </div>
        ))}
      </motion.div>

      {/* Year — left side */}
      <motion.div
        className="absolute bottom-10 left-8 lg:left-14 z-10 hidden lg:block"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 3.1, duration: 0.9 }}
      >
        <span className="text-[9px] text-[#333] tracking-[0.4em] uppercase">©2019 — 2025</span>
      </motion.div>

      {/* Subtle vignette edge */}
      <div className="absolute inset-0 z-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.5)" }}
      />
    </section>
  );
}
