"use client";
import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import Image from "next/image";
import { projects } from "@/lib/data";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";
import { Grid, LayoutList, Minus, Film } from "lucide-react";

type Layout = "masonry" | "grid" | "list" | "cinema";

/* ─── Card ──────────────────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
  layout,
}: {
  project: (typeof projects)[0];
  index: number;
  layout: Layout;
}) {
  const [hovered, setHovered] = useState(false);

  if (layout === "list") {
    return (
      <motion.div
        className="group border-b border-white/8 py-5 flex items-center gap-6 cursor-none"
        initial={{ opacity: 0, x: -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.055, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-cursor-hover
      >
        <span className="text-[#333] text-sm font-light w-6 flex-shrink-0 tabular-nums">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="relative w-14 h-10 overflow-hidden rounded-sm flex-shrink-0">
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="56px"
          />
        </div>

        <span className="flex-1 text-white group-hover:text-[#d4af37] transition-colors duration-300 text-sm font-light tracking-wide">
          {project.title}
        </span>

        <span className="hidden md:block text-[#555] text-xs tracking-widest uppercase">
          {project.category}
        </span>
        <span className="text-[#444] text-xs">{project.year}</span>

        <motion.div
          className="h-px bg-[#d4af37] flex-shrink-0"
          animate={{ width: hovered ? 28 : 16 }}
          transition={{ duration: 0.25 }}
        />
      </motion.div>
    );
  }

  const isLarge = layout === "masonry" && (index === 0 || index === 3);

  return (
    <motion.div
      className={`group relative overflow-hidden cursor-none rounded-sm ${
        isLarge ? "row-span-2" : ""
      }`}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cursor-hover
    >
      <div className={`relative w-full overflow-hidden ${isLarge ? "h-full min-h-[480px]" : "aspect-[4/3]"}`}>
        {/* Image with zoom */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>

        {/* Dark overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
          animate={{ opacity: hovered ? 1 : 0.5 }}
          transition={{ duration: 0.4 }}
        />

        {/* 3-D tilt feel with subtle highlight */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Info overlay */}
        <motion.div
          className="absolute inset-0 p-5 flex flex-col justify-end"
          animate={{ y: hovered ? 0 : 6 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-3 h-px bg-[#d4af37]" />
            <span className="text-[9px] tracking-[0.35em] uppercase text-[#d4af37]">
              {project.category}
            </span>
          </div>

          <h3 className="text-white font-display text-xl leading-tight">{project.title}</h3>

          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="overflow-hidden"
              >
                <p className="text-[#aaa] text-xs mt-2 leading-relaxed line-clamp-2">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] tracking-[0.15em] uppercase border border-white/15 px-2 py-0.5 text-[#999] rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ─── Cinema horizontal drag-scroll ────────────────────────────── */

function CinemaGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = containerRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.clientX;
    scrollLeft.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !containerRef.current) return;
    const delta = e.clientX - startX.current;
    containerRef.current.scrollLeft = scrollLeft.current - delta;
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Hint */}
      <p className="text-[#444] text-xs tracking-[0.3em] uppercase mb-6 text-center">
        ← Drag to explore →
      </p>

      <div
        ref={containerRef}
        className="horizontal-scroll-container flex gap-4 pb-4 select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            className="flex-shrink-0 relative overflow-hidden rounded-sm group cursor-none"
            style={{ width: "clamp(260px, 32vw, 460px)", height: "clamp(340px, 45vw, 580px)" }}
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            data-cursor-hover
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105 pointer-events-none"
              draggable={false}
              sizes="460px"
            />

            {/* Permanent bottom info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <p className="text-[9px] tracking-[0.3em] uppercase text-[#d4af37] mb-1">
                {project.category} — {project.year}
              </p>
              <h3 className="font-display text-xl text-white">{project.title}</h3>
            </div>

            {/* Index watermark */}
            <div className="absolute top-4 right-5 font-display text-5xl text-white/[0.06] select-none leading-none">
              {String(i + 1).padStart(2, "0")}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Section ───────────────────────────────────────────────────── */

const LAYOUT_BUTTONS: { key: Layout; icon: React.ReactNode; label: string }[] = [
  { key: "masonry", icon: <Grid size={13} />,      label: "Masonry" },
  { key: "grid",    icon: <LayoutList size={13} />, label: "Grid" },
  { key: "cinema",  icon: <Film size={13} />,       label: "Cinema" },
  { key: "list",    icon: <Minus size={13} />,      label: "List" },
];

export default function FeaturedWork() {
  const [layout, setLayout] = useState<Layout>("masonry");

  return (
    <section id="work" className="relative bg-[#0a0a0a] section-padding overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div>
            <motion.div variants={fadeUp} className="flex items-center gap-4 mb-4">
              <div className="w-8 h-px bg-[#d4af37]" />
              <span className="text-[11px] tracking-[0.4em] uppercase text-[#d4af37]">Portfolio</span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              className="font-display text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.9] text-white"
            >
              Selected
              <br />
              <em className="text-gradient not-italic">Works</em>
            </motion.h2>
          </div>

          {/* Layout toggle */}
          <motion.div variants={fadeUp} className="flex items-center gap-1 glass rounded-full p-1">
            {LAYOUT_BUTTONS.map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => setLayout(key)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[11px] tracking-wide transition-all duration-300 cursor-none ${
                  layout === key
                    ? "bg-white text-black font-medium"
                    : "text-[#bdbdbd] hover:text-white"
                }`}
                data-cursor-hover
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </motion.div>
        </motion.div>

        {/* Gallery area */}
        <AnimatePresence mode="wait">

          {/* Masonry */}
          {layout === "masonry" && (
            <motion.div
              key="masonry"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              style={{ gridAutoRows: "280px" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} layout="masonry" />
              ))}
            </motion.div>
          )}

          {/* Grid */}
          {layout === "grid" && (
            <motion.div
              key="grid"
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} layout="grid" />
              ))}
            </motion.div>
          )}

          {/* Cinema drag-scroll */}
          {layout === "cinema" && (
            <motion.div
              key="cinema"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <CinemaGallery />
            </motion.div>
          )}

          {/* List */}
          {layout === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={i} layout="list" />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
