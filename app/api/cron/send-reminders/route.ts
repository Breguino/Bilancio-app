import { NextResponse } from "next/server";
import { isAuthorizedCronRequest } from "@/lib/cron-auth";
import { sendDueReminders } from "@/lib/reminders/send";

// Vercel Cron chiama questa route (vedi vercel.json) con un header
// Authorization che deve combaciare con CRON_SECRET — chiunque altro riceve 401.
export async function GET(request: Request) {
  if (!isAuthorizedCronRequest(request)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const origin = new URL(request.url).origin;
  const result = await sendDueReminders(origin);
  return NextResponse.json(result);
}
