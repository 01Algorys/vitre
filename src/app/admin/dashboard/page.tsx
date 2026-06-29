import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import { getSetting, getProjects, getTestimonials, getServices, getProcessSteps } from "@/lib/db";
import { DEFAULT_HERO, DEFAULT_ABOUT, DEFAULT_CONTACT, DEFAULT_FOOTER } from "@/lib/data";
import type { HeroContent, AboutContent, ContactContent, FooterContent } from "@/types";
import type { SEOContent } from "@/components/admin/SEOPanel";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) redirect("/admin");

  const [hero, about, contact, footer, seo, projects, testimonials, services, process] = await Promise.all([
    getSetting<HeroContent>(supabase, "hero"),
    getSetting<AboutContent>(supabase, "about"),
    getSetting<ContactContent>(supabase, "contact"),
    getSetting<FooterContent>(supabase, "footer"),
    getSetting<SEOContent>(supabase, "seo"),
    getProjects(supabase),
    getTestimonials(supabase),
    getServices(supabase),
    getProcessSteps(supabase),
  ]);

  const initial = {
    hero:         hero         ?? DEFAULT_HERO,
    about:        about        ?? DEFAULT_ABOUT,
    contact:      contact      ?? DEFAULT_CONTACT,
    footer:       footer       ?? DEFAULT_FOOTER,
    seo:          seo          ?? { title: "", description: "", ogTitle: "", ogDescription: "", ogImage: "", keywords: "", canonical: "", robots: "index, follow" },
    projects,
    testimonials,
    services,
    process,
  };

  return <AdminDashboardClient initial={initial} userEmail={session.user.email ?? ""} />;
}
