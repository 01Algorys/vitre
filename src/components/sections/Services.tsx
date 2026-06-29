"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Building2, Camera, User, Briefcase, Heart, Star, Film, Aperture, ArrowUpRight } from "lucide-react";
import type { Service } from "@/types";
import { services as defaultServices } from "@/lib/data";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

const ICON_MAP: Record<string, React.ReactNode> = {
  building:  <Building2 size={20} />,
  camera:    <Camera    size={20} />,
  user:      <User      size={20} />,
  briefcase: <Briefcase size={20} />,
  heart:     <Heart     size={20} />,
  star:      <Star      size={20} />,
  film:      <Film      size={20} />,
  aperture:  <Aperture  size={20} />,
};

interface Props { services?: Service[] }

export default function Services({ services = defaultServices }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="services" className="relative bg-[#0d0d0d] section-padding overflow-hidden">

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "70px 70px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto">

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
            <span className="text-[11px] tracking-[0.4em] uppercase text-[#d4af37]">Services</span>
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2
              variants={fadeUp}
              className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] text-white"
            >
              What I<br />
              <em className="text-gradient not-italic">Create</em>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#666] max-w-sm text-sm leading-relaxed">
              Every project is unique. These are the disciplines I practice — each approached
              with obsessive attention to light, form, and feeling.
            </motion.p>
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 rounded-sm overflow-hidden">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              className="group relative bg-[#0d0d0d] p-10 overflow-hidden cursor-none"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={viewportConfig}
              transition={{ delay: i * 0.08 }}
              onMouseEnter={() => setHovered(service.id)}
              onMouseLeave={() => setHovered(null)}
              data-cursor-hover
            >
              {/* Hover fill */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/6 via-transparent to-transparent"
                animate={{ opacity: hovered === service.id ? 1 : 0 }}
                transition={{ duration: 0.45 }}
              />

              {/* Animated corner accent */}
              <motion.div
                className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-[#d4af37]/20 rounded-tr-sm"
                animate={{
                  opacity: hovered === service.id ? 1 : 0,
                  scale:   hovered === service.id ? 1 : 0.7,
                }}
                transition={{ duration: 0.4 }}
              />

              <div className="relative z-10">
                {/* Top row */}
                <div className="flex items-start justify-between mb-8">
                  <motion.div
                    className="text-[#d4af37] p-3 border border-[#d4af37]/15 rounded-sm"
                    animate={{
                      borderColor: hovered === service.id ? "rgba(212,175,55,0.4)" : "rgba(212,175,55,0.15)",
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {ICON_MAP[service.icon] ?? <Camera size={20} />}
                  </motion.div>
                  <span className="font-display text-5xl text-white/[0.06]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3
                  className={`text-lg font-light tracking-wide mb-4 transition-colors duration-300 ${
                    hovered === service.id ? "text-[#d4af37]" : "text-white"
                  }`}
                >
                  {service.title}
                </h3>

                <div
                  className="rich-text text-[#666] text-sm leading-relaxed mb-8"
                  dangerouslySetInnerHTML={{ __html: service.description }}
                />

                <motion.div
                  className="flex items-center gap-2 text-[#d4af37] text-[10px] tracking-[0.25em] uppercase"
                  animate={{ x: hovered === service.id ? 4 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span>Enquire</span>
                  <ArrowUpRight size={12} />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
