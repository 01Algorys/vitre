import { Project, Testimonial, Service, ProcessStep, HeroContent, AboutContent, ContactContent, FooterContent } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    title: "Vows at First Light",
    category: "Wedding",
    year: "2024",
    description:
      "A dawn ceremony on the Tunisian coast — golden light breaking over the sea just as two lives became one. Every frame a quiet miracle.",
    image: "/L1021465.jpeg",
    tags: ["Wedding", "Golden Hour", "Coast"],
    featured: true,
  },
  {
    id: "2",
    title: "Parisian Souls",
    category: "Portrait",
    year: "2024",
    description:
      "Intimate portrait sessions scattered across Paris — from Haussmann balconies to the quiet banks of the Seine at dusk.",
    image: "/L1020678.jpeg",
    tags: ["Portrait", "Paris", "Intimate"],
    featured: true,
  },
  {
    id: "3",
    title: "Saharan Ceremony",
    category: "Wedding",
    year: "2024",
    description:
      "A desert wedding in southern Tunisia — ancient sand dunes, lanterns at dusk, and a silence that made every whisper eternal.",
    image: "/DSC_32x71.jpg",
    tags: ["Wedding", "Desert", "Tunisia"],
    featured: true,
  },
  {
    id: "4",
    title: "Between Two Cities",
    category: "Fine Art",
    year: "2023",
    description:
      "A personal series exploring the visual contrast between Mediterranean light and Parisian shadow — two homes, one lens.",
    image: "/L1020370.jpeg",
    tags: ["Fine Art", "Series", "Identity"],
  },
  {
    id: "5",
    title: "The Quiet Ones",
    category: "Portrait",
    year: "2023",
    description:
      "Black-and-white portraits of artists in their natural environments — studios, stages, and solitary moments of creation.",
    image: "/_DSC0785.JPG",
    tags: ["Portrait", "B&W", "Artists"],
  },
  {
    id: "6",
    title: "Bloom & Lace",
    category: "Wedding",
    year: "2023",
    description:
      "A spring wedding in Tunis — jasmine in the hair, laughter in the courtyard, and light filtering through ancient wooden shutters.",
    image: "/_CAR1247.jpeg",
    tags: ["Wedding", "Spring", "Tunis"],
  },
  {
    id: "7",
    title: "Editorial Noir",
    category: "Fashion",
    year: "2023",
    description:
      "High-contrast fashion work shot across Parisian rooftops and Tunisian medinas — architecture and clothing in quiet dialogue.",
    image: "/Z62_5449.jpg",
    tags: ["Fashion", "Editorial", "Noir"],
  },
  {
    id: "8",
    title: "The Last Dance",
    category: "Wedding",
    year: "2022",
    description:
      "Capturing the most unguarded moment of a wedding day — when the music fades and two people hold each other a little longer.",
    image: "/L1031685.jpeg",
    tags: ["Wedding", "Dance", "Emotion"],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Yasmine & Karim",
    role: "Wedding Couple",
    company: "Hammamet, Tunisia",
    text: "Cherif didn't just photograph our wedding — he preserved every feeling we had that day. When we look at the photos, we don't see images. We relive the moments. He is truly exceptional.",
  },
  {
    id: "2",
    name: "Sophie Laurent",
    role: "Art Director",
    company: "Paris Fashion Week",
    text: "Working with Cherif was a completely different experience. He understands light like a painter and emotion like a poet. Our editorial campaign exceeded every expectation.",
  },
  {
    id: "3",
    name: "Leila & Omar",
    role: "Wedding Couple",
    company: "Tunis, Tunisia",
    text: "We had 157,000 reasons to trust Cherif — every person who follows his work online. But what convinced us was meeting him. His calm, his vision, his love for what he does. Our photos are breathtaking.",
  },
  {
    id: "4",
    name: "Marc Delacroix",
    role: "Creative Director",
    company: "Maison Lumière, Paris",
    text: "Cherif brought an entirely new visual vocabulary to our brand campaign. His ability to blend Mediterranean warmth with Parisian sophistication is unlike anything I've seen in 20 years.",
  },
  {
    id: "5",
    name: "Amina & Youssef",
    role: "Wedding Couple",
    company: "Sidi Bou Said, Tunisia",
    text: "We still get messages from guests saying they've never seen wedding photos so alive. Cherif captured not just us, but the whole soul of our family gathered in one place.",
  },
];

export const services: Service[] = [
  {
    id: "1",
    title: "Wedding Photography",
    description:
      "Your wedding day told as a cinematic story. From quiet morning preparations to the last dance — every detail, every tear, every laugh, preserved forever with intention and artistry.",
    icon: "camera",
  },
  {
    id: "2",
    title: "Portrait Sessions",
    description:
      "Intimate, unhurried portrait sessions that reveal who you truly are. Studio or location — in Tunisia or Paris — crafted around your personality, your light, your story.",
    icon: "user",
  },
  {
    id: "3",
    title: "Fashion & Editorial",
    description:
      "High-fashion campaign and editorial work that marries clothing with architecture and landscape. A visual language built on contrast, mood, and Mediterranean light.",
    icon: "briefcase",
  },
  {
    id: "4",
    title: "Commercial & Brand",
    description:
      "Brand-defining imagery for companies, hotels, and cultural institutions. Photography that elevates your product from commodity to story — seen, felt, and remembered.",
    icon: "building",
  },
];

export const processSteps: ProcessStep[] = [
  {
    id: "1",
    number: "01",
    title: "Discovery",
    description:
      "We start with a conversation — not a form. I want to understand your story, your people, your vision. This first exchange shapes everything that follows and ensures what we create is authentically yours.",
  },
  {
    id: "2",
    number: "02",
    title: "Planning",
    description:
      "Meticulous preparation: location scouting, timeline building, light planning, and mood direction. Great photography is made long before the shutter clicks — in the details that most photographers skip.",
  },
  {
    id: "3",
    number: "03",
    title: "Shooting",
    description:
      "On the day, preparation dissolves into presence. I move quietly, observe deeply, and capture moments as they unfold — never staging what is real, always preserving what is true.",
  },
  {
    id: "4",
    number: "04",
    title: "Editing",
    description:
      "Each image is treated as a unique artwork. My editing style is signature: rich tones, cinematic contrast, and a warmth that feels timeless rather than trendy. Every photo is hand-edited with care.",
  },
  {
    id: "5",
    number: "05",
    title: "Delivery",
    description:
      "Your gallery delivered in a private online space — high-resolution files, print-ready and web-optimised. With full licensing and archival quality that will last a lifetime, and beyond.",
  },
];

// ─── Default CMS content (used as fallback when DB is empty) ─────────────────

export const DEFAULT_HERO: HeroContent = {
  eyebrow: "Photographer — Tunisia · Paris",
  firstName: "Cherif",
  lastName: "Ouali",
  tagline: "When photography is not all about just taking photos, but telling a story.",
  ctaPrimary:   { label: "Discover My Work", href: "#work" },
  ctaSecondary: { label: "Book a Session",   href: "#contact" },
  stats: [
    { num: "180+", label: "Projects" },
    { num: "12",   label: "Awards" },
    { num: "8",    label: "Years" },
  ],
  copyright: "©2019 — 2025",
};

export const DEFAULT_ABOUT: AboutContent = {
  heading: "When photography is not all about just taking photos, but telling a story.",
  bio1: "I'm Cherif Ouali — a photographer and visual artist living between Tunisia and Paris. For six years I've been chasing light: at dawn on Mediterranean shores, in the warm gold of a Tunisian courtyard, in the rain-slicked streets of the Marais at midnight.",
  bio2: "My work spans weddings, portraits, fashion, and fine art — but every image shares the same intention: to preserve not just what happened, but how it felt. With 157K followers trusting my eye on Instagram, and a second account dedicated entirely to weddings (@cherifouali_weddings), storytelling is the thread connecting everything I create.",
  stats: [
    { value: "157K", label: "Instagram followers" },
    { value: "561+", label: "Stories captured" },
    { value: "10",   label: "Years of experience" },
    { value: "2",    label: "Countries, one vision" },
  ],
  location: "Based in Tunisia & Paris",
  availabilityBadge: "Available for bookings",
  photo: "/_CAR1188 copy.jpeg",
};

export const DEFAULT_CONTACT: ContactContent = {
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

export const DEFAULT_FOOTER: FooterContent = {
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
