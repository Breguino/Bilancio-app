import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isProtectedPath } from "@/lib/routes";

const PUBLIC_EXACT = [
  "/",
  "/robots.txt",
  "/sitemap.xml",
  "/chi-siamo",
  "/cosa-offriamo",
  "/il-servizio",
  "/novita",
  "/reset-password",
  "/privacy",
  "/termini",
  "/newsletter/disiscritto",
];
// "/guide" è un prefisso e non un elenco di indirizzi esatti: le guide servono a
// farsi trovare da chi non ha ancora un account, quindi ogni nuova guida deve
// essere pubblica da subito senza doversi ricordare di aggiungerla qui.
const PUBLIC_PREFIXES = ["/login", "/signup", "/auth", "/logout", "/guide", "/api/cron", "/api/newsletter"];

function isPublicPath(path: string) {
  if (PUBLIC_EXACT.includes(path)) return true;
  return PUBLIC_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`));
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  if (!isPublicPath(path) && isProtectedPath(path) && !user) {
    // Un redirect su una richiesta non-GET rompe le Server Action: Next.js prova a
    // inoltrare la risposta dell'action attraverso il redirect e falla con
    // "failed to forward action response", quindi il form non fa niente e l'utente
    // non vede alcun errore. Neghiamo comunque, ma con uno stato che non redirige.
    if (request.method !== "GET") {
      return new NextResponse(null, { status: 401 });
    }
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", path);
    return NextResponse.redirect(redirectUrl);
  }

  if ((path === "/login" || path === "/signup") && user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}
