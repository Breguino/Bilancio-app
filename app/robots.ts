import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/signup"],
      disallow: [
        "/dashboard",
        "/budget",
        "/goals",
        "/compare",
        "/yearly",
        "/recurring",
        "/contacts",
        "/receipt",
        "/api",
        "/auth",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
