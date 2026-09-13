import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyResendSignature } from "@/lib/webhooks/resend-signature";

// Dove Resend ci racconta com'è andata ogni email: consegnata, rimbalzata,
// segnalata come spam. Serve soprattutto per i rimbalzi: il motivo vero lo
// scrive il server che rifiuta ("550 ...", "421 ..."), e senza un indirizzo
// che lo riceva quel testo resta visibile solo a mano nel pannello di Resend.
//
// Chi lo chiama non ha un account e non può averne uno: l'unica prova di
// identità è la firma sul corpo del messaggio.
export async function POST(request: Request) {
  // Il corpo va letto grezzo, non come JSON: la firma è calcolata sui byte
  // esatti che sono arrivati. Riserializzare un oggetto cambierebbe spazi e
  // ordine delle chiavi, e la firma non tornerebbe più.
  const corpo = await request.text();

  const esito = verifyResendSignature(
    corpo,
    {
      id: request.headers.get("svix-id"),
      timestamp: request.headers.get("svix-timestamp"),
      signature: request.headers.get("svix-signature"),
    },
    process.env.RESEND_WEBHOOK_SECRET
  );

  if (!esito.valido) {
    // Il motivo non torna indietro a chi chiama: a un mittente non autorizzato
    // non si spiega perché non è passato.
    return new NextResponse("Unauthorized", { status: 401 });
  }

  let evento: ResendWebhookPayload;
  try {
    evento = JSON.parse(corpo);
  } catch {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const dati = evento.data ?? {};
  const supabase = createAdminClient();

  // `upsert` su svix_id, non `insert`: Resend riprova la consegna finché non
  // riceve un 2xx, quindi la stessa notifica arriva più volte. Senza questo,
  // un rimbalzo comparirebbe cinque volte e sembrerebbero cinque rimbalzi.
  await supabase.from("email_events").upsert(
    {
      svix_id: request.headers.get("svix-id"),
      type: evento.type ?? "sconosciuto",
      email_id: dati.email_id ?? null,
      recipient: Array.isArray(dati.to) ? dati.to.join(", ") : (dati.to ?? null),
      subject: dati.subject ?? null,
      reason: dati.bounce?.message ?? null,
      bounce_type: dati.bounce?.type ?? null,
      payload: evento,
    },
    { onConflict: "svix_id" }
  );

  return new NextResponse(null, { status: 204 });
}

type ResendWebhookPayload = {
  type?: string;
  data?: {
    email_id?: string;
    to?: string | string[];
    subject?: string;
    bounce?: { message?: string; type?: string; subType?: string };
  };
};
