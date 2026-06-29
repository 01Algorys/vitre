"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";
import { Send, Globe, Share2, Phone } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import type { ContactContent } from "@/types";

const DEFAULT: ContactContent = {
  headingLine1: "Let's Tell",
  headingLine2: "Your Story",
  headingLine3: "Together.",
  email: "hello@CherifOuali.com",
  location: "Tunisia · Paris",
  locationNote: "Available for travel worldwide",
  availabilityText: "Accepting wedding & portrait bookings for 2025–2026. Response within 24 hours via email or WhatsApp.",
  socials: [
    { type: "instagram",          href: "https://www.instagram.com/cherifouali",          label: "@cherifouali",         sub: "561 posts · 157K followers" },
    { type: "instagram-weddings", href: "https://www.instagram.com/cherifouali_weddings", label: "@cherifouali_weddings", sub: "Wedding portfolio" },
    { type: "whatsapp-tn",        href: "https://wa.me/21620802314",                      label: "+216 20 802 314",       sub: "WhatsApp available" },
    { type: "whatsapp-fr",        href: "https://wa.me/33752999651",                      label: "+33 7 52 99 96 51",    sub: "WhatsApp available" },
  ],
};

/* Deterministic particle positions */
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  left:     ((i * 41 + 13) % 97) + 1.5,
  top:      ((i * 67 + 7)  % 93) + 3,
  duration: 3.5 + (i % 6) * 0.6,
  delay:    (i * 0.38) % 4,
  size:     i % 3 === 0 ? "w-1.5 h-1.5" : "w-1 h-1",
}));

function socialIcon(type: string) {
  if (type.startsWith("whatsapp")) return <Phone size={13} />;
  if (type.startsWith("instagram")) return <Globe size={13} />;
  return <Share2 size={13} />;
}

type FormState = { name: string; email: string; project: string; message: string };
const FIELDS = [
  { field: "name",    label: "Your Name",    type: "text",  placeholder: "Yasmine & Karim" },
  { field: "email",   label: "Email Address",type: "email", placeholder: "hello@example.com" },
  { field: "project", label: "Project Type", type: "text",  placeholder: "Wedding, Portrait, Fashion…" },
] as const;

interface Props { data?: ContactContent }

export default function Contact({ data = DEFAULT }: Props) {
  const [form, setForm]         = useState<FormState>({ name: "", email: "", project: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section id="contact" className="relative bg-[#0a0a0a] section-padding overflow-hidden">

      {/* Ghost text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
        <span className="font-display text-[22vw] text-white/[0.013] whitespace-nowrap leading-none">Contact</span>
      </div>

      {/* Particles */}
      {PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-[#d4af37]/20 ${p.size}`}
          style={{ left: `${p.left}%`, top: `${p.top}%` }}
          animate={{ y: [0, -22, 0], opacity: [0.15, 0.55, 0.15] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
        />
      ))}

      <div className="relative z-10 max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="mb-16"
        >
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-6">
            <div className="w-8 h-px bg-[#d4af37]" />
            <span className="text-[11px] tracking-[0.4em] uppercase text-[#d4af37]">Contact</span>
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="font-display text-[clamp(3rem,8vw,7rem)] leading-[0.88] text-white"
          >
            {data.headingLine1}<br />
            <em className="text-gradient-gold not-italic">{data.headingLine2}</em><br />
            {data.headingLine3}
          </motion.h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-28">

          {/* Form */}
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={viewportConfig}>
            {submitted ? (
              <motion.div className="flex flex-col items-start gap-5 py-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <div className="w-14 h-14 rounded-full border border-[#d4af37]/50 flex items-center justify-center">
                  <Send size={18} className="text-[#d4af37]" />
                </div>
                <h3 className="font-display text-3xl text-white">Message received.</h3>
                <p className="text-[#777] text-sm leading-relaxed max-w-sm">
                  Thank you for reaching out. I&apos;ll be in touch within 48 hours to discuss your project and begin telling your story.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {FIELDS.map(({ field, label, type, placeholder }) => (
                  <div key={field} className="group">
                    <label className="block text-[10px] tracking-[0.35em] uppercase text-[#555] mb-2.5">{label}</label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={form[field]}
                      onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                      required
                      className="w-full bg-transparent border-b border-white/12 focus:border-[#d4af37] py-3 text-white placeholder-[#333] text-sm outline-none transition-colors duration-400 cursor-none"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-[10px] tracking-[0.35em] uppercase text-[#555] mb-2.5">Tell me your story</label>
                  <textarea
                    placeholder="Describe your vision, your date, your people…"
                    value={form.message}
                    onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                    required
                    rows={4}
                    className="w-full bg-transparent border-b border-white/12 focus:border-[#d4af37] py-3 text-white placeholder-[#333] text-sm outline-none resize-none transition-colors duration-400 cursor-none"
                  />
                </div>
                <MagneticButton className="inline-flex items-center gap-3 bg-white text-black px-9 py-3.5 text-[11px] tracking-[0.28em] uppercase font-medium hover:bg-[#d4af37] transition-colors duration-300 rounded-full">
                  <span>Send Message</span>
                  <Send size={11} />
                </MagneticButton>
              </form>
            )}
          </motion.div>

          {/* Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            className="flex flex-col justify-between gap-10"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#555] mb-3">Email</p>
              <a href={`mailto:${data.email}`} className="font-display text-2xl text-white hover:text-[#d4af37] transition-colors duration-300" data-cursor-hover>
                {data.email}
              </a>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#555] mb-3">Based in</p>
              <p className="text-[#ccc] text-lg font-light">📍 {data.location}</p>
              <p className="text-[#555] text-sm mt-1.5">{data.locationNote}</p>
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-[10px] tracking-[0.35em] uppercase text-[#555] mb-5">Connect</p>
              <div className="flex flex-col gap-5">
                {data.socials.map(({ type, href, label, sub }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 text-[#777] hover:text-white transition-colors duration-300"
                    data-cursor-hover
                  >
                    <div className="mt-0.5 w-8 h-8 border border-white/10 group-hover:border-[#d4af37]/40 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                      {socialIcon(type)}
                    </div>
                    <div>
                      <p className="text-sm font-light leading-tight">{label}</p>
                      <p className="text-[11px] text-[#444] mt-0.5">{sub}</p>
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="glass rounded-sm p-6 border border-white/5">
              <div className="flex items-center gap-3 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#777]">Currently available</span>
              </div>
              <p className="text-[#555] text-xs leading-relaxed">{data.availabilityText}</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
