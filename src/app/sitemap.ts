import type { MetadataRoute } from "next";
import { articles } from "@/lib/education";
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.APP_BASE_URL;
  if (!base) return [];
  return [
    "",
    "/learn",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    ...articles.map((a) => `/learn/${a.slug}`),
  ].map((path) => ({
    url: `${base.replace(/\/$/, "")}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
