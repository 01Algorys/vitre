"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { processSteps } from "@/lib/data";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";
import { Plus, Minus } from "lucide-react";

export default function Process() {
  const [active, setActive] = useState<string | null>("1");

  const toggle = (id: string) => setActive((prev) => (prev === id ? null : id));

  return (
    <section id="process" className="relative bg-[#111111] section-padding overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "80px 80px",
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
            <span className="text-[11px] tracking-[0.4em] uppercase text-[#d4af37]">Process</span>
          </motion.div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2
              variants={fadeUp}
              className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-[0.9] text-white"
            >
              How We<br />
              <em className="text-gradient not-italic">Work Together</em>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#666] max-w-xs text-sm leading-relaxed">
              A seamless journey from concept to final delivery —
              built on communication, craft, and creative trust.
            </motion.p>
          </div>
        </motion.div>

        {/* Accordion steps */}
        <div>
          {processSteps.map((step, i) => {
            const isOpen = active === step.id;
            return (
              <motion.div
                key={step.id}
                className="border-b border-white/8"
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportConfig}
                transition={{ delay: i * 0.08 }}
              >
                <button
                  className="w-full flex items-center gap-6 py-7 text-left cursor-none group"
                  onClick={() => toggle(step.id)}
                  data-cursor-hover
                >
                  {/* Step number */}
                  <span
                    className={`font-display text-5xl leading-none flex-shrink-0 transition-colors duration-500 ${
                      isOpen ? "text-[#d4af37]/60" : "text-white/10 group-hover:text-white/20"
                    }`}
                  >
                    {step.number}
                  </span>

                  {/* Title */}
                  <span
                    className={`flex-1 text-xl font-light tracking-wide transition-colors duration-300 ${
                      isOpen ? "text-[#d4af37]" : "text-white group-hover:text-[#e5e5e5]"
                    }`}
                  >
                    {step.title}
                  </span>

                  {/* Toggle icon */}
                  <motion.div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      isOpen
                        ? "border-[#d4af37]/40 text-[#d4af37]"
                        : "border-white/10 text-[#555] group-hover:border-white/30 group-hover:text-[#999]"
                    }`}
                    animate={{ rotate: isOpen ? 0 : 0 }}
                  >
                    {isOpen ? <Minus size={12} /> : <Plus size={12} />}
                  </motion.div>
                </button>

                {/* Expandable description */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="text-[#888] text-sm leading-relaxed pb-8 pl-[calc(3rem+24px)] max-w-2xl">
                        {step.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom decoration */}
        <motion.div
          className="mt-16 flex items-center gap-4"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
          <span className="text-[10px] tracking-[0.45em] uppercase text-[#444]">
            From concept to delivery
          </span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
