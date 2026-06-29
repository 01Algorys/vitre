export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  tags: string[];
  featured?: boolean;
  // Extended fields (populated from Supabase)
  slug?: string;
  published?: boolean;
  client?: string;
  location?: string;
  sort_order?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  image?: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  price?: string;
}

export interface ProcessStep {
  id: string;
  number: string;
  title: string;
  description: string;
}

export interface MousePosition {
  x: number;
  y: number;
}

// --- CMS content types ---

export interface StatItem   { num: string; label: string }
export interface AboutStat  { value: string; label: string }

export interface HeroContent {
  eyebrow: string;
  firstName: string;
  lastName: string;
  tagline: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  stats: StatItem[];
  copyright: string;
}

export interface AboutContent {
  heading: string;
  bio1: string;
  bio2: string;
  stats: AboutStat[];
  location: string;
  availabilityBadge: string;
  photo: string;
}

export interface ContactSocial {
  type: string;
  href: string;
  label: string;
  sub: string;
}

export interface ContactContent {
  headingLine1: string;
  headingLine2: string;
  headingLine3: string;
  email: string;
  location: string;
  locationNote: string;
  availabilityText: string;
  socials: ContactSocial[];
}

export interface FooterLink   { label: string; href: string }
export interface FooterSocial { type: string; href: string; label: string }

export interface FooterContent {
  name: string;
  tagline: string;
  copyright: string;
  locationTag: string;
  links: FooterLink[];
  socials: FooterSocial[];
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  contact: ContactContent;
  footer: FooterContent;
}
