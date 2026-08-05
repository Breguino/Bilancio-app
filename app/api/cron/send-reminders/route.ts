import { NextResponse } from "next/server";
import { sendDueReminders } from "@/lib/reminders/send";

// Vercel Cron chiama questa route (vedi vercel.json) con un header
// Authorization che deve combaciare con CRON_SECRET — chiunque altro riceve 401.
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const origin = new URL(request.url).origin;
  const result = await sendDueReminders(origin);
  return NextResponse.json(result);
}
