import Navigation       from "@/components/layout/Navigation";
import Footer           from "@/components/layout/Footer";
import Hero             from "@/components/sections/Hero";
import About            from "@/components/sections/About";
import FeaturedWork     from "@/components/sections/FeaturedWork";
import ImmersiveShowcase from "@/components/sections/ImmersiveShowcase";
import Services         from "@/components/sections/Services";
import Testimonials     from "@/components/sections/Testimonials";
import Process          from "@/components/sections/Process";
import Contact          from "@/components/sections/Contact";
import { AwardsMarquee } from "@/components/ui/Marquee";
import { createClient } from "@/lib/supabase/server";
import { getSetting, getProjects, getTestimonials, getServices, getProcessSteps } from "@/lib/db";
import { DEFAULT_HERO, DEFAULT_ABOUT, DEFAULT_CONTACT, DEFAULT_FOOTER } from "@/lib/data";
import type { HeroContent, AboutContent, ContactContent, FooterContent } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const supabase = await createClient();

  const [hero, about, contact, footer, projects, testimonials, services, process] = await Promise.all([
    getSetting<HeroContent>(supabase, "hero"),
    getSetting<AboutContent>(supabase, "about"),
    getSetting<ContactContent>(supabase, "contact"),
    getSetting<FooterContent>(supabase, "footer"),
    getProjects(supabase, { publishedOnly: true }),
    getTestimonials(supabase),
    getServices(supabase),
    getProcessSteps(supabase),
  ]);

  return (
    <main className="relative">
      <Navigation />
      <Hero         data={hero         ?? DEFAULT_HERO} />
      <AwardsMarquee />
      <About        data={about        ?? DEFAULT_ABOUT} />
      <FeaturedWork projects={projects.length ? projects : undefined} />
      <ImmersiveShowcase projects={projects.length ? projects : undefined} />
      <AwardsMarquee className="opacity-60" />
      <Services     services={services.length ? services : undefined} />
      <Testimonials testimonials={testimonials.length ? testimonials : undefined} />
      <Process      steps={process.length ? process : undefined} />
      <Contact      data={contact      ?? DEFAULT_CONTACT} />
      <Footer       data={footer       ?? DEFAULT_FOOTER} />
    </main>
  );
}
