import type { MetadataRoute } from "next";
import { crawlerDisallowList } from "@/lib/routes";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/signup"],
      // Derivato dall'elenco delle rotte riservate invece che riscritto a
      // mano: una nuova pagina protetta finisce qui da sola, senza che ci si
      // debba ricordare di aggiornare due liste separate.
      disallow: crawlerDisallowList(),
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
