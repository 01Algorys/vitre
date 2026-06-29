import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content");

export function readContent<T>(filename: string): T {
  const filepath = path.join(CONTENT_DIR, filename);
  const raw = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(raw) as T;
}

export function writeContent(filename: string, data: unknown): void {
  const filepath = path.join(CONTENT_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), "utf-8");
}

export const SECTION_FILE_MAP: Record<string, string> = {
  hero: "site.json",
  about: "site.json",
  contact: "site.json",
  footer: "site.json",
  projects: "projects.json",
  testimonials: "testimonials.json",
  services: "services.json",
  process: "process.json",
};

export function readSection<T>(section: string): T {
  const file = SECTION_FILE_MAP[section];
  if (!file) throw new Error(`Unknown section: ${section}`);

  if (file === "site.json") {
    const site = readContent<Record<string, unknown>>("site.json");
    return site[section] as T;
  }
  return readContent<T>(file);
}

export function writeSection(section: string, data: unknown): void {
  const file = SECTION_FILE_MAP[section];
  if (!file) throw new Error(`Unknown section: ${section}`);

  if (file === "site.json") {
    const site = readContent<Record<string, unknown>>("site.json");
    site[section] = data;
    writeContent("site.json", site);
  } else {
    writeContent(file, data);
  }
}
