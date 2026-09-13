import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function disiscrivi(token: string) {
  const supabase = createAdminClient();
  await supabase
    .from("newsletter_subscribers")
    .update({ unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .is("unsubscribed_at", null);
}

function tokenDa(request: Request): string | null {
  return new URL(request.url).searchParams.get("token");
}

// Il link dentro l'email: disiscrive e porta alla pagina di conferma.
export async function GET(request: Request) {
  const token = tokenDa(request);
  if (!token) return NextResponse.redirect(new URL("/", request.url));

  await disiscrivi(token);
  return NextResponse.redirect(new URL("/newsletter/disiscritto", request.url));
}

// La disiscrizione con un colpo solo (RFC 8058): non la chiede una persona,
// la manda il programma di posta quando si tocca "Annulla iscrizione"
// accanto al mittente. Deve funzionare senza conferma e senza accesso, e
// deve rispondere 200 con del testo — non un redirect, che qui non avrebbe
// nessuno da portare da nessuna parte.
//
// Il token nell'indirizzo è l'unica prova di identità, ed è l'unica che
// serve: è l'email stessa, appena arrivata, a portarlo.
export async function POST(request: Request) {
  const token = tokenDa(request);
  if (!token) return new NextResponse("Missing token", { status: 400 });

  await disiscrivi(token);
  return new NextResponse("Unsubscribed", { status: 200 });
}
