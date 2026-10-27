import type { MetadataRoute } from "next";
import { business, collections } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages: [string, number][] = [
    ["", 1],
    ["/appointment", 0.9],
    ["/tuxedos", 0.8],
    ["/services", 0.7],
    ["/about", 0.7],
    ["/faq", 0.6],
    ["/contact", 0.6],
  ];
  return [
    ...pages.map(([p, priority]) => ({ url: `${business.url}${p}`, lastModified: now, changeFrequency: "monthly" as const, priority })),
    ...collections.map((c) => ({ url: `${business.url}/collections/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}
