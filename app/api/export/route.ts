import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { csvField } from "@/lib/csv-export";

export async function GET(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { data: transactions } = await supabase
    .from("transactions")
    .select("date, description, category, amount, contact:contacts(name)")
    .order("date", { ascending: true });

  const rows = [["Data", "Descrizione", "Categoria", "Cliente", "Importo"]];
  (transactions || []).forEach((t: any) => {
    rows.push([
      t.date,
      t.description,
      t.category || "Entrata",
      t.contact?.name || "",
      String(t.amount).replace(".", ","),
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
