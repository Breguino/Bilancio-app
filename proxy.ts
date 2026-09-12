import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

// Si chiamava `middleware.ts` fino a Next 15. Da Next 16 il nome è `proxy`, e
// gira sul runtime Node invece che su quello edge: è il runtime di default e
// non è configurabile.
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
