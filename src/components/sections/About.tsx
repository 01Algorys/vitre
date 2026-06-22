"use client";
import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import {
  fadeUp,
  slideRight,
  staggerContainer,
  viewportConfig,
} from "@/lib/animations";

const STATS = [
  { value: "157K", label: "Instagram followers" },
  { value: "561+", label: "Stories captured" },
  { value: "10",   label: "Years of experience" },
  { value: "2",    label: "Countries, one vision" },
];

export default function About() {
  const ref    = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);

  const [imgSrc, setImgSrc] = useState("/_CAR1188 copy.jpeg");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY    = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const bgTextX = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"]);

  return (
    <section id="about" ref={ref} className="relative bg-[#0a0a0a] section-padding overflow-hidden">

      {/* Ghost background text */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 select-none pointer-events-none z-0"
        style={{ x: bgTextX }}
      >
        <span className="font-display text-[28vw] text-white/[0.018] whitespace-nowrap leading-none">
          About
        </span>
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Section label */}
        <motion.div
          className="flex items-center gap-4 mb-20"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div className="w-8 h-px bg-[#d4af37]" />
          <span className="text-[11px] tracking-[0.45em] uppercase text-[#d4af37]">About</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28 items-center">

          {/* Portrait */}
          <motion.div
            className="relative"
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {/* Clip-mask reveal */}
            <motion.div
              className="relative aspect-[3/4] overflow-hidden rounded-sm"
              initial={{ clipPath: "inset(0 100% 0 0)" }}
              whileInView={{ clipPath: "inset(0 0% 0 0)" }}
              viewport={{ once: true, margin: "-15% 0px" }}
              transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
            >
              <motion.div
                ref={imgRef}
                className="absolute inset-[-12%]"
                style={{ y: imgY }}
              >
                <Image
                  src={imgSrc}
                  alt="Cherif Ouali — Photographer"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onError={() => setImgSrc("/L1020678.jpeg")}
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 to-transparent" />
            </motion.div>

            {/* Instagram badge */}
            <motion.div
              className="absolute -bottom-8 -right-4 md:-right-8 glass-strong rounded-sm p-5 hidden md:block"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="font-display text-4xl text-white leading-none">157K</div>
              <div className="text-[10px] text-[#888] tracking-[0.3em] uppercase mt-1.5">
                Instagram Followers
              </div>
            </motion.div>

            {/* Gold accent line */}
            <motion.div
              className="absolute -left-4 top-12 bottom-12 w-px bg-gradient-to-b from-transparent via-[#d4af37]/40 to-transparent hidden md:block"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>

          {/* Text */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
          >
            {/* Main quote — his actual tagline */}
            <motion.h2
              variants={fadeUp}
              className="font-display text-[clamp(2rem,5vw,4.5rem)] leading-[0.95] text-white mb-10"
            >
              &ldquo;When photography
              <br />
              is not all about
              <br />
              just taking photos,
              <br />
              <em className="text-gradient-gold not-italic">but telling a story.&rdquo;</em>
            </motion.h2>

            <motion.p variants={fadeUp} className="text-[#aaa] text-base leading-relaxed mb-5">
              I&apos;m Cherif Ouali — a photographer and visual artist living between
              Tunisia and Paris. For six years I&apos;ve been chasing light: at dawn on
              Mediterranean shores, in the warm gold of a Tunisian courtyard, in the
              rain-slicked streets of the Marais at midnight.
            </motion.p>

            <motion.p variants={fadeUp} className="text-[#666] text-sm leading-relaxed mb-12">
              My work spans weddings, portraits, fashion, and fine art — but every image
              shares the same intention: to preserve not just what happened, but how
              it felt. With 157K followers trusting my eye on Instagram, and a second
              account dedicated entirely to weddings&nbsp;
              <span className="text-[#888]">(@cherifouali_weddings)</span>, storytelling
              is the thread connecting everything I create.
            </motion.p>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-x-8 gap-y-7 mb-12">
              {STATS.map(({ value, label }) => (
                <div key={label} className="border-l border-white/10 pl-4 group">
                  <div className="font-display text-4xl text-white group-hover:text-[#d4af37] transition-colors duration-500 leading-none mb-1">
                    {value}
                  </div>
                  <div className="text-[11px] text-[#555] tracking-wide uppercase">{label}</div>
                </div>
              ))}
            </motion.div>

            {/* Location pill */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-px bg-[#d4af37]" />
                <span className="text-[11px] tracking-[0.3em] uppercase text-[#888]">
                  Based in Tunisia &amp; Paris
                </span>
              </div>
              <div className="flex items-center gap-2 glass rounded-full px-4 py-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#777]">
                  Available for bookings
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
