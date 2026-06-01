"use client";
import { useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

const NAV_LINKS = [
  { label: "Work",     href: "#work" },
  { label: "About",   href: "#about" },
  { label: "Services",href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact", href: "#contact" },
];

export default function Navigation() {
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [hidden, setHidden]         = useState(false);
  const [lastY, setLastY]           = useState(0);
  const { scrollY }                 = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 60);
    setHidden(v > lastY + 8 && v > 200);
    setLastY(v);
  });

  /* lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 lg:px-14 py-5 flex items-center justify-between transition-all duration-700 ${
          scrolled ? "glass border-b border-white/5" : ""
        }`}
        initial={{ opacity: 0, y: -24 }}
        animate={{ opacity: 1, y: hidden ? -100 : 0 }}
        transition={{ duration: 0.6, delay: scrolled ? 0 : 1.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Logo */}
        <MagneticButton
          href="#"
          className="font-display text-xl text-white tracking-[0.25em] font-light"
        >
          CO
        </MagneticButton>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <MagneticButton
              key={link.href}
              href={link.href}
              className="relative text-[#888] hover:text-white text-[11px] tracking-[0.25em] uppercase transition-colors duration-300 group"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#d4af37] group-hover:w-full transition-all duration-300" />
            </MagneticButton>
          ))}
        </div>

        {/* Desktop CTA */}
        <MagneticButton
          href="#contact"
          className="hidden md:inline-flex items-center gap-2 border border-white/15 hover:border-[#d4af37]/50 px-5 py-2 text-[10px] tracking-[0.25em] uppercase text-[#999] hover:text-white transition-all duration-400 rounded-full"
        >
          Book a session
        </MagneticButton>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-[5px] cursor-none p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          data-cursor-hover
        >
          <motion.span
            className="block w-6 h-px bg-white origin-center"
            animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="block w-4 h-px bg-white"
            animate={menuOpen ? { opacity: 0, x: -8 } : { opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block w-6 h-px bg-white origin-center"
            animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        </button>
      </motion.nav>

      {/* Mobile full-screen menu */}
      <motion.div
        className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col items-center justify-center gap-10 md:hidden"
        initial={false}
        animate={menuOpen
          ? { opacity: 1, clipPath: "inset(0 0 0% 0)" }
          : { opacity: 0, clipPath: "inset(0 0 100% 0)" }
        }
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
      >
        {NAV_LINKS.map((link, i) => (
          <motion.a
            key={link.href}
            href={link.href}
            className="font-display text-5xl text-white tracking-wide hover:text-[#d4af37] transition-colors duration-300"
            onClick={() => setMenuOpen(false)}
            initial={{ opacity: 0, y: 30 }}
            animate={menuOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ delay: i * 0.07 + 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {link.label}
          </motion.a>
        ))}

        <motion.a
          href="mailto:hello@CherifOuali.com"
          className="text-sm text-[#555] tracking-widest mt-4"
          initial={{ opacity: 0 }}
          animate={menuOpen ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5 }}
        >
          hello@CherifOuali.com
        </motion.a>
      </motion.div>
    </>
  );
}
