"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "@/lib/data";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";

const EASE = [0.16, 1, 0.3, 1] as const;

const variants = {
  enter: (d: number) => ({
    x: d > 0 ? 60 : -60,
    opacity: 0,
    filter: "blur(10px)",
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.75, ease: EASE },
  },
  exit: (d: number) => ({
    x: d > 0 ? -60 : 60,
    opacity: 0,
    filter: "blur(10px)",
    transition: { duration: 0.35 },
  }),
};

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [dir, setDir]         = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setCurrent((p) => (p + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const navigate = (d: number) => {
    setDir(d);
    setCurrent((p) => (p + d + testimonials.length) % testimonials.length);
  };

  return (
    <section className="relative bg-[#0a0a0a] section-padding overflow-hidden">

      {/* Centre vertical hairline */}
      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-white/[0.04] to-transparent pointer-events-none" />

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mb-20"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#d4af37]" />
            <span className="text-[11px] tracking-[0.4em] uppercase text-[#d4af37]">Testimonials</span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] text-white"
          >
            Voices of<br />
            <em className="text-gradient not-italic">Trust</em>
          </motion.h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative min-h-[300px] flex items-start">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={current}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full"
            >
              {/* Opening quote mark */}
              <div className="font-display text-[8rem] leading-none text-[#d4af37]/12 select-none mb-0 -mt-8">
                &ldquo;
              </div>

              <blockquote className="font-display text-[clamp(1.2rem,3vw,2.2rem)] text-white leading-relaxed mb-10 -mt-4">
                {testimonials[current].text}
              </blockquote>

              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#222] to-[#111] border border-white/8 flex items-center justify-center text-base font-medium text-white font-display">
                  {testimonials[current].name.charAt(0)}
                </div>
                <div>
                  <p className="text-white text-sm font-light">{testimonials[current].name}</p>
                  <p className="text-[#555] text-xs tracking-wide">
                    {testimonials[current].role} — {testimonials[current].company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-14">

          {/* Dot indicators */}
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDir(i > current ? 1 : -1); setCurrent(i); }}
                className="h-px transition-all duration-500 cursor-none"
                style={{
                  width: i === current ? 28 : 14,
                  background: i === current ? "#fff" : "rgba(255,255,255,0.15)",
                }}
                data-cursor-hover
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            <MagneticButton
              onClick={() => navigate(-1)}
              className="w-11 h-11 border border-white/12 hover:border-white/40 rounded-full flex items-center justify-center text-[#777] hover:text-white transition-all duration-300"
            >
              <ChevronLeft size={14} />
            </MagneticButton>
            <MagneticButton
              onClick={() => navigate(1)}
              className="w-11 h-11 border border-white/12 hover:border-white/40 rounded-full flex items-center justify-center text-[#777] hover:text-white transition-all duration-300"
            >
              <ChevronRight size={14} />
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
