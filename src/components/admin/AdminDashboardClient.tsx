"use client";
import { useState, useCallback } from "react";
import AdminBar from "@/components/admin/AdminBar";
import EditableSection from "@/components/admin/EditableSection";
import EditPanel from "@/components/admin/EditPanel";
import { ToastProvider } from "@/components/admin/Toast";
import UnsavedChangesBar, { useUnsavedChangesWarning } from "@/components/admin/UnsavedChangesGuard";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import type {
  HeroContent, AboutContent, ContactContent, FooterContent,
  Project, Testimonial, Service, ProcessStep,
} from "@/types";
import type { SEOContent } from "@/components/admin/SEOPanel";

import Hero           from "@/components/sections/Hero";
import About          from "@/components/sections/About";
import FeaturedWork   from "@/components/sections/FeaturedWork";
import ImmersiveShowcase from "@/components/sections/ImmersiveShowcase";
import Services       from "@/components/sections/Services";
import Testimonials   from "@/components/sections/Testimonials";
import Process        from "@/components/sections/Process";
import Contact        from "@/components/sections/Contact";
import Footer         from "@/components/layout/Footer";
import { AwardsMarquee } from "@/components/ui/Marquee";

type SectionKey = "hero" | "about" | "contact" | "footer" | "projects" | "testimonials" | "services" | "process" | "seo";

interface AllContent {
  hero: HeroContent;
  about: AboutContent;
  contact: ContactContent;
  footer: FooterContent;
  seo: SEOContent;
  projects: Project[];
  testimonials: Testimonial[];
  services: Service[];
  process: ProcessStep[];
}

interface Props {
  initial: AllContent;
  userEmail: string;
}

function Dashboard({ initial, userEmail }: Props) {
  const [content,       setContent]       = useState<AllContent>(initial);
  const [activeSection, setActiveSection] = useState<SectionKey | null>(null);
  const [savedContent,  setSavedContent]  = useState<AllContent>(initial);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Track whether local state diverges from saved state
  const hasChanges = JSON.stringify(content) !== JSON.stringify(savedContent);
  useUnsavedChangesWarning(hasChanges);

  // Live preview: EditPanel calls this on every keystroke
  const handleChange = useCallback((section: SectionKey, data: AllContent[SectionKey]) => {
    setContent((prev) => ({ ...prev, [section]: data }));
  }, []);

  // Called when EditPanel saves to Supabase successfully
  const handleSaved = useCallback(() => {
    setSavedContent({ ...content });
  }, [content]);

  const handleDiscard = useCallback(() => {
    setContent(savedContent);
    setActiveSection(null);
  }, [savedContent]);

  const edit = (section: SectionKey) => setActiveSection(section);

  return (
    <div className="relative min-h-screen bg-[#0a0a0a]">
      <AdminBar
        content={content as unknown as Record<string, unknown>}
        onOpenSection={(s) => edit(s as SectionKey)}
        onOpenAnalytics={() => setShowAnalytics(true)}
      />

      {/* Analytics overlay */}
      <AnimatePresence>
        {showAnalytics && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[8000]" onClick={() => setShowAnalytics(false)} />
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl bg-[#111] border border-white/10 rounded-2xl p-6 z-[8100] shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-display text-xl">Dashboard Analytics</h2>
                <button onClick={() => setShowAnalytics(false)} className="text-[#555] hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <AnalyticsDashboard />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Website preview with 56px top offset for admin bar */}
      <div className="pt-14">
        <EditableSection label="Hero" onEdit={() => edit("hero")}>
          <Hero data={content.hero} />
        </EditableSection>

        <AwardsMarquee />

        <EditableSection label="About" onEdit={() => edit("about")}>
          <About data={content.about} />
        </EditableSection>

        <EditableSection label="Projects" onEdit={() => edit("projects")}>
          <FeaturedWork projects={content.projects} />
        </EditableSection>

        <EditableSection label="Showcase" onEdit={() => edit("projects")}>
          <ImmersiveShowcase projects={content.projects} />
        </EditableSection>

        <AwardsMarquee className="opacity-60" />

        <EditableSection label="Services" onEdit={() => edit("services")}>
          <Services services={content.services} />
        </EditableSection>

        <EditableSection label="Testimonials" onEdit={() => edit("testimonials")}>
          <Testimonials testimonials={content.testimonials} />
        </EditableSection>

        <EditableSection label="Process" onEdit={() => edit("process")}>
          <Process steps={content.process} />
        </EditableSection>

        <EditableSection label="Contact" onEdit={() => edit("contact")}>
          <Contact data={content.contact} />
        </EditableSection>

        <EditableSection label="Footer" onEdit={() => edit("footer")}>
          <Footer data={content.footer} />
        </EditableSection>
      </div>

      <EditPanel
        section={activeSection}
        data={activeSection ? (content[activeSection] as AllContent[SectionKey]) : null}
        userEmail={userEmail}
        onClose={() => setActiveSection(null)}
        onChange={handleChange}
      />

      <UnsavedChangesBar
        hasChanges={hasChanges}
        onSave={handleSaved}
        onDiscard={handleDiscard}
      />
    </div>
  );
}

export default function AdminDashboardClient(props: Props) {
  return (
    <ToastProvider>
      <Dashboard {...props} />
    </ToastProvider>
  );
}
