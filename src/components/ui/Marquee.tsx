"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

interface MarqueeProps {
  items: string[];
  speed?: number;
  /** reverse scroll direction for bottom strip */
  reverse?: boolean;
  className?: string;
}

export default function Marquee({
  items,
  speed = 35,
  reverse = false,
  className = "",
}: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    reverse ? ["0%", "-8%"] : ["0%", "8%"]
  );

  /* duplicate items so the CSS marquee seamlessly loops */
  const doubled = [...items, ...items, ...items, ...items];

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ x }} className="will-change-transform">
        <div
          className="flex items-center whitespace-nowrap"
          style={{
            animation: `marquee ${speed}s linear infinite${reverse ? " reverse" : ""}`,
          }}
        >
          {doubled.map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-6 px-8"
            >
              <span className="font-display text-[clamp(1.1rem,2.2vw,1.6rem)] text-white/10 tracking-widest uppercase italic select-none">
                {item}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37]/30 flex-shrink-0" />
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── AwardsMarquee preset ──────────────────────────────────── */

const AWARDS = [
  "@cherifouali",
  "157K Followers",
  "Wedding Photography",
  "Tunisia · Paris",
  "Portrait Sessions",
  "@cherifouali_weddings",
  "Fashion & Editorial",
  "Storytelling Through Light",
  "Available Worldwide",
  "561 Stories Told",
];

export function AwardsMarquee({ className = "" }: { className?: string }) {
  return (
    <div className={`relative py-7 border-y border-white/5 overflow-hidden ${className}`}>
      {/* top-strip */}
      <Marquee items={AWARDS} speed={28} />
    </div>
  );
}
