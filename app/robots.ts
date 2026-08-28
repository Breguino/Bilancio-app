import type { MetadataRoute } from "next";
import { crawlerDisallowList } from "@/lib/routes";
import { SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/signup"],
      // Derivato dall'elenco delle rotte riservate invece che riscritto a
      // mano: una nuova pagina protetta finisce qui da sola, senza che ci si
      // debba ricordare di aggiornare due liste separate.
      disallow: crawlerDisallowList(),
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
