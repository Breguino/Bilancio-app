import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { csvField, csvHeaders } from "@/lib/csv-export";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getUserCurrency } from "@/lib/currency-server";

export async function GET(request: Request) {
  const { locale, t } = await getDictionary();
  const valuta = await getUserCurrency();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("date, description, category, amount, contact:contacts(name)")
    .is("deleted_at", null)
    .order("date", { ascending: true });

  const rows = [csvHeaders(t.csv.headers, valuta)];
  (transactions || []).forEach((t2: any) => {
    rows.push([
      t2.date,
      t2.description,
      t2.category || t.csv.incomeLabel,
      t2.contact?.name || "",
      locale === "it" ? String(t2.amount).replace(".", ",") : String(t2.amount),
    ]);
  });

  const csv = "﻿" + rows.map((r) => r.map(csvField).join(";")).join("\r\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bilancino-movimenti.csv"',
    },
  });
}
