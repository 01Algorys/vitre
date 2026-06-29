"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/types";
import { projects as defaultProjects } from "@/lib/data";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";

interface Props { projects?: Project[] }

function ShowcaseItem({ project, index, total }: { project: Project; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const imgY    = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);
  const textX   = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    index % 2 === 0 ? [-40, 0, 0, -20] : [40, 0, 0, 20]
  );

  const isRight = index % 2 !== 0;
  const TOTAL   = String(total).padStart(2, "0");

  return (
    <div ref={ref} className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div className="absolute inset-[-12%]" style={{ y: imgY }}>
          <Image src={project.image} alt={project.title} fill className="object-cover" sizes="100vw" priority={index === 0} />
        </motion.div>
        <div
          className="absolute inset-0"
          style={{
            background: isRight
              ? "linear-gradient(to left, rgba(10,10,10,0.92) 40%, rgba(10,10,10,0.4) 70%, transparent 100%)"
              : "linear-gradient(to right, rgba(10,10,10,0.92) 40%, rgba(10,10,10,0.4) 70%, transparent 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/60" />
      </div>

      <motion.div
        className={`relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex ${isRight ? "justify-end" : "justify-start"}`}
        style={{ opacity }}
      >
        <motion.div
          className="max-w-lg"
          style={{ x: textX }}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20% 0px" }}
        >
          <motion.div variants={fadeUp} className="flex items-center gap-3 mb-8">
            <div className="w-6 h-px bg-[#d4af37]" />
            <span className="text-[10px] tracking-[0.5em] uppercase text-[#d4af37]">
              {String(index + 1).padStart(2, "0")} / {TOTAL}
            </span>
          </motion.div>

          <motion.p variants={fadeUp} className="text-[10px] tracking-[0.35em] uppercase text-[#777] mb-3">
            {project.category} — {project.year}
          </motion.p>

          <motion.h2 variants={fadeUp} className="font-display text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.88] text-white mb-7">
            {project.title}
          </motion.h2>

          <motion.div
            variants={fadeUp}
            className="rich-text text-[#aaa] text-base leading-relaxed mb-10"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />

          <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-12">
            {project.tags.map((tag) => (
              <span key={tag} className="text-[9px] tracking-[0.2em] uppercase border border-white/12 px-3 py-1 text-[#888] rounded-full">
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.a
            variants={fadeUp}
            href="#work"
            className="inline-flex items-center gap-3 text-white text-[11px] tracking-[0.25em] uppercase cursor-none group"
            data-cursor-hover
          >
            <span className="border-b border-white/30 group-hover:border-white pb-px transition-colors duration-300">View Project</span>
            <motion.span className="block h-px bg-white" initial={{ width: 24 }} whileHover={{ width: 40 }} transition={{ duration: 0.3 }} />
          </motion.a>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-6 right-8 z-10 select-none pointer-events-none">
        <span className="font-display text-[12rem] leading-none text-white/[0.025]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

export default function ImmersiveShowcase({ projects = defaultProjects }: Props) {
  const list = projects.length > 0 ? projects : defaultProjects;
  const featured = list.filter((p) => p.featured).slice(0, 3);
  const showcaseProjects = featured.length > 0 ? featured : list.slice(0, 3);

  return (
    <section className="relative bg-[#0a0a0a]">
      <div className="section-padding max-w-7xl mx-auto">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={viewportConfig}>
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#d4af37]" />
            <span className="text-[11px] tracking-[0.4em] uppercase text-[#d4af37]">Exhibition</span>
          </motion.div>
          <motion.h2 variants={fadeUp} className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] text-white">
            Immersive<br /><em className="text-gradient not-italic">Showcase</em>
          </motion.h2>
        </motion.div>
      </div>

      {showcaseProjects.map((project, i) => (
        <ShowcaseItem key={project.id} project={project} index={i} total={showcaseProjects.length} />
      ))}
    </section>
  );
}
