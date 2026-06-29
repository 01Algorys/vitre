-- ============================================================
-- Seed existing portfolio content into Supabase
-- Run this AFTER schema.sql in the Supabase SQL Editor
-- ============================================================

-- ─── Site Settings ───────────────────────────────────────────

INSERT INTO site_settings (key, value) VALUES
('hero', '{
  "eyebrow": "Photographer — Tunisia · Paris",
  "firstName": "Cherif",
  "lastName": "Ouali",
  "tagline": "When photography is not all about just taking photos, but telling a story.",
  "ctaPrimary": {"label": "Discover My Work", "href": "#work"},
  "ctaSecondary": {"label": "Book a Session", "href": "#contact"},
  "stats": [
    {"num": "180+", "label": "Projects"},
    {"num": "12",   "label": "Awards"},
    {"num": "8",    "label": "Years"}
  ],
  "copyright": "©2019 — 2025"
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value) VALUES
('about', '{
  "heading": "When photography is not all about just taking photos, but telling a story.",
  "bio1": "<p>I''m Cherif Ouali — a photographer and visual artist living between Tunisia and Paris. For six years I''ve been chasing light: at dawn on Mediterranean shores, in the warm gold of a Tunisian courtyard, in the rain-slicked streets of the Marais at midnight.</p>",
  "bio2": "<p>My work spans weddings, portraits, fashion, and fine art — but every image shares the same intention: to preserve not just what happened, but how it felt. With 157K followers trusting my eye on Instagram, and a second account dedicated entirely to weddings (@cherifouali_weddings), storytelling is the thread connecting everything I create.</p>",
  "stats": [
    {"value": "157K", "label": "Instagram followers"},
    {"value": "561+", "label": "Stories captured"},
    {"value": "10",   "label": "Years of experience"},
    {"value": "2",    "label": "Countries, one vision"}
  ],
  "location": "Based in Tunisia & Paris",
  "availabilityBadge": "Available for bookings",
  "photo": "/_CAR1188 copy.jpeg"
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value) VALUES
('contact', '{
  "headingLine1": "Let''s Tell",
  "headingLine2": "Your Story",
  "headingLine3": "Together.",
  "email": "hello@CherifOuali.com",
  "location": "Tunisia · Paris",
  "locationNote": "Available for travel worldwide",
  "availabilityText": "Accepting wedding & portrait bookings for 2025–2026. Response within 24 hours via email or WhatsApp.",
  "socials": [
    {"type": "instagram",          "href": "https://www.instagram.com/cherifouali",          "label": "@cherifouali",         "sub": "561 posts · 157K followers"},
    {"type": "instagram-weddings", "href": "https://www.instagram.com/cherifouali_weddings", "label": "@cherifouali_weddings", "sub": "Wedding portfolio"},
    {"type": "whatsapp-tn",        "href": "https://wa.me/21620802314",                      "label": "+216 20 802 314",       "sub": "WhatsApp available"},
    {"type": "whatsapp-fr",        "href": "https://wa.me/33752999651",                      "label": "+33 7 52 99 96 51",    "sub": "WhatsApp available"}
  ]
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value) VALUES
('footer', '{
  "name": "Cherif Ouali",
  "tagline": "Wedding & Fashion Photographer",
  "copyright": "©2019 — 2025 Cherif Ouali. All rights reserved.",
  "locationTag": "Photography Portfolio — Tunisia & Paris",
  "links": [
    {"label": "Work",     "href": "#work"},
    {"label": "About",   "href": "#about"},
    {"label": "Services","href": "#services"},
    {"label": "Contact", "href": "#contact"}
  ],
  "socials": [
    {"type": "instagram", "href": "https://www.instagram.com/cherifouali",          "label": "Instagram"},
    {"type": "weddings",  "href": "https://www.instagram.com/cherifouali_weddings", "label": "Weddings"},
    {"type": "whatsapp",  "href": "https://wa.me/21620802314",                      "label": "WhatsApp"},
    {"type": "email",     "href": "mailto:hello@CherifOuali.com",                   "label": "Email"}
  ]
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO site_settings (key, value) VALUES
('seo', '{
  "title": "Cherif Ouali — Wedding & Portrait Photographer · Tunisia · Paris",
  "description": "Visual storytelling across weddings, portraits, fashion, and fine art. Based in Tunisia and Paris, available worldwide.",
  "ogTitle": "Cherif Ouali Photography",
  "ogDescription": "Visual storytelling across weddings, portraits, fashion, and fine art.",
  "ogImage": "",
  "keywords": "photographer, wedding photographer, Tunisia, Paris, portrait, fashion, fine art",
  "canonical": "https://cherifouali.com",
  "robots": "index, follow"
}')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- ─── Projects ────────────────────────────────────────────────

INSERT INTO projects (title, slug, category, year, description, cover_image, tags, featured, published, sort_order) VALUES
('Vows at First Light',  'vows-at-first-light',  'Wedding',  '2024', 'A dawn ceremony on the Tunisian coast — golden light breaking over the sea just as two lives became one. Every frame a quiet miracle.',                                                                     '/L1021465.jpeg',    ARRAY['Wedding','Golden Hour','Coast'],      true,  true, 0),
('Parisian Souls',       'parisian-souls',        'Portrait', '2024', 'Intimate portrait sessions scattered across Paris — from Haussmann balconies to the quiet banks of the Seine at dusk.',                                                                                         '/L1020678.jpeg',    ARRAY['Portrait','Paris','Intimate'],         true,  true, 1),
('Saharan Ceremony',     'saharan-ceremony',      'Wedding',  '2024', 'A desert wedding in southern Tunisia — ancient sand dunes, lanterns at dusk, and a silence that made every whisper eternal.',                                                                                  '/DSC_32x71.jpg',    ARRAY['Wedding','Desert','Tunisia'],          true,  true, 2),
('Between Two Cities',   'between-two-cities',    'Fine Art', '2023', 'A personal series exploring the visual contrast between Mediterranean light and Parisian shadow — two homes, one lens.',                                                                                       '/L1020370.jpeg',    ARRAY['Fine Art','Series','Identity'],        false, true, 3),
('The Quiet Ones',       'the-quiet-ones',        'Portrait', '2023', 'Black-and-white portraits of artists in their natural environments — studios, stages, and solitary moments of creation.',                                                                                      '/_DSC0785.JPG',     ARRAY['Portrait','B&W','Artists'],            false, true, 4),
('Bloom & Lace',         'bloom-and-lace',        'Wedding',  '2023', 'A spring wedding in Tunis — jasmine in the hair, laughter in the courtyard, and light filtering through ancient wooden shutters.',                                                                            '/_CAR1247.jpeg',    ARRAY['Wedding','Spring','Tunis'],            false, true, 5),
('Editorial Noir',       'editorial-noir',        'Fashion',  '2023', 'High-contrast fashion work shot across Parisian rooftops and Tunisian medinas — architecture and clothing in quiet dialogue.',                                                                                 '/Z62_5449.jpg',     ARRAY['Fashion','Editorial','Noir'],          false, true, 6),
('The Last Dance',       'the-last-dance',        'Wedding',  '2022', 'Capturing the most unguarded moment of a wedding day — when the music fades and two people hold each other a little longer.',                                                                                  '/L1031685.jpeg',    ARRAY['Wedding','Dance','Emotion'],           false, true, 7)
ON CONFLICT DO NOTHING;

-- ─── Services ────────────────────────────────────────────────

INSERT INTO services (title, description, icon, price, sort_order) VALUES
('Wedding Photography',    'Your wedding day told as a cinematic story. From quiet morning preparations to the last dance — every detail, every tear, every laugh, preserved forever with intention and artistry.',    'camera',    '',   0),
('Portrait Sessions',      'Intimate, unhurried portrait sessions that reveal who you truly are. Studio or location — in Tunisia or Paris — crafted around your personality, your light, your story.',                  'user',      '',   1),
('Fashion & Editorial',    'High-fashion campaign and editorial work that marries clothing with architecture and landscape. A visual language built on contrast, mood, and Mediterranean light.',                         'briefcase', '',   2),
('Commercial & Brand',     'Brand-defining imagery for companies, hotels, and cultural institutions. Photography that elevates your product from commodity to story — seen, felt, and remembered.',                      'building',  '',   3)
ON CONFLICT DO NOTHING;

-- ─── Testimonials ────────────────────────────────────────────

INSERT INTO testimonials (name, role, company, text, sort_order) VALUES
('Yasmine & Karim', 'Wedding Couple',    'Hammamet, Tunisia',      'Cherif didn''t just photograph our wedding — he preserved every feeling we had that day. When we look at the photos, we don''t see images. We relive the moments. He is truly exceptional.', 0),
('Sophie Laurent',  'Art Director',      'Paris Fashion Week',     'Working with Cherif was a completely different experience. He understands light like a painter and emotion like a poet. Our editorial campaign exceeded every expectation.',                  1),
('Leila & Omar',    'Wedding Couple',    'Tunis, Tunisia',          'We had 157,000 reasons to trust Cherif — every person who follows his work online. But what convinced us was meeting him. His calm, his vision, his love for what he does. Our photos are breathtaking.', 2),
('Marc Delacroix',  'Creative Director', 'Maison Lumière, Paris',  'Cherif brought an entirely new visual vocabulary to our brand campaign. His ability to blend Mediterranean warmth with Parisian sophistication is unlike anything I''ve seen in 20 years.',    3),
('Amina & Youssef', 'Wedding Couple',    'Sidi Bou Said, Tunisia', 'We still get messages from guests saying they''ve never seen wedding photos so alive. Cherif captured not just us, but the whole soul of our family gathered in one place.',                  4)
ON CONFLICT DO NOTHING;

-- ─── Process Steps ───────────────────────────────────────────

INSERT INTO process_steps (number, title, description, sort_order) VALUES
('01', 'Discovery', 'We start with a conversation — not a form. I want to understand your story, your people, your vision. This first exchange shapes everything that follows and ensures what we create is authentically yours.', 0),
('02', 'Planning',  'Meticulous preparation: location scouting, timeline building, light planning, and mood direction. Great photography is made long before the shutter clicks — in the details that most photographers skip.', 1),
('03', 'Shooting',  'On the day, preparation dissolves into presence. I move quietly, observe deeply, and capture moments as they unfold — never staging what is real, always preserving what is true.',                          2),
('04', 'Editing',   'Each image is treated as a unique artwork. My editing style is signature: rich tones, cinematic contrast, and a warmth that feels timeless rather than trendy. Every photo is hand-edited with care.',        3),
('05', 'Delivery',  'Your gallery delivered in a private online space — high-resolution files, print-ready and web-optimised. With full licensing and archival quality that will last a lifetime, and beyond.',                   4)
ON CONFLICT DO NOTHING;
