"use client";
import { motion } from "framer-motion";
import { Globe, Share2, Phone, Mail } from "lucide-react";
import MagneticButton from "@/components/ui/MagneticButton";
import { fadeUp, staggerContainer, viewportConfig } from "@/lib/animations";
import type { FooterContent } from "@/types";

const DEFAULT: FooterContent = {
  name: "Cherif Ouali",
  tagline: "Wedding & Fashion Photographer",
  copyright: "©2019 — 2025 Cherif Ouali. All rights reserved.",
  locationTag: "Photography Portfolio — Tunisia & Paris",
  links: [
    { label: "Work",     href: "#work" },
    { label: "About",   href: "#about" },
    { label: "Services",href: "#services" },
    { label: "Contact", href: "#contact" },
  ],
  socials: [
    { type: "instagram", href: "https://www.instagram.com/cherifouali",          label: "Instagram" },
    { type: "weddings",  href: "https://www.instagram.com/cherifouali_weddings", label: "Weddings" },
    { type: "whatsapp",  href: "https://wa.me/21620802314",                      label: "WhatsApp" },
    { type: "email",     href: "mailto:hello@CherifOuali.com",                   label: "Email" },
  ],
};

function socialIcon(type: string) {
  if (type === "email")   return <Mail   size={13} />;
  if (type === "whatsapp") return <Phone  size={13} />;
  if (type === "weddings") return <Share2 size={13} />;
  return <Globe size={13} />;
}

interface Props { data?: FooterContent }

export default function Footer({ data = DEFAULT }: Props) {
  return (
    <footer className="relative bg-[#0a0a0a] border-t border-white/[0.04] py-20 px-6 md:px-10 lg:px-16 overflow-hidden">

      <div className="absolute inset-0 noise-bg pointer-events-none opacity-20" />

      {/* Ghost monogram */}
      <div className="absolute bottom-0 right-0 translate-x-[15%] translate-y-[20%] select-none pointer-events-none">
        <span className="font-display text-[22vw] text-white/[0.012] leading-none">CO</span>
      </div>

      <motion.div
        className="relative z-10 max-w-7xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={viewportConfig}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 mb-20">

          {/* Brand */}
          <motion.div variants={fadeUp}>
            <h3 className="font-display text-3xl text-white mb-5 font-light">{data.name}</h3>
            <p className="text-[#555] text-sm leading-relaxed max-w-xs">{data.tagline}</p>
          </motion.div>

          {/* Navigation */}
          <motion.div variants={fadeUp}>
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-[#444] mb-6">Navigation</h4>
            <ul className="space-y-3">
              {data.links.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="text-sm text-[#666] hover:text-white transition-colors duration-300 font-light">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div variants={fadeUp}>
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-[#444] mb-6">Connect</h4>
            <div className="flex gap-3 mb-6">
              {data.socials.map(({ type, href, label }) => (
                <MagneticButton
                  key={label}
                  href={href}
                  className="w-10 h-10 border border-white/8 hover:border-[#d4af37]/40 rounded-full flex items-center justify-center text-[#555] hover:text-white transition-all duration-300"
                >
                  {socialIcon(type)}
                </MagneticButton>
              ))}
            </div>
            {data.socials
              .filter((s) => s.type === "email")
              .map((s) => (
                <a key={s.href} href={s.href} className="text-sm text-[#666] hover:text-white transition-colors duration-300 font-light block mb-2">
                  {s.href.replace("mailto:", "")}
                </a>
              ))}
            {data.socials
              .filter((s) => s.type === "whatsapp")
              .map((s) => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#666] hover:text-white transition-colors duration-300 font-light block">
                  {s.label}
                </a>
              ))}
          </motion.div>
        </div>

        {/* Bottom */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/[0.04] gap-4"
        >
          <p className="text-[10px] text-[#333] tracking-[0.35em] uppercase">{data.copyright}</p>
          <p className="text-[10px] text-[#333] tracking-widest uppercase">{data.locationTag}</p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
