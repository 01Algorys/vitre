import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ImmersiveShowcase from "@/components/sections/ImmersiveShowcase";
import Services from "@/components/sections/Services";
import Testimonials from "@/components/sections/Testimonials";
import Process from "@/components/sections/Process";
import Contact from "@/components/sections/Contact";
import { AwardsMarquee } from "@/components/ui/Marquee";

export default function Home() {
  return (
    <main className="relative">
      <Navigation />

      <Hero />

      {/* Awards ticker — sits between Hero and About */}
      <AwardsMarquee />

      <About />

      <FeaturedWork />

      <ImmersiveShowcase />

      {/* Second ticker between Showcase and Services */}
      <AwardsMarquee className="opacity-60" />

      <Services />

      <Testimonials />

      <Process />

      <Contact />

      <Footer />
    </main>
  );
}
