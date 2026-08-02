"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LOCALE_COOKIE, locales } from "./locales";

export async function setLocale(formData: FormData) {
  const locale = String(formData.get("locale") || "");
  if (!(locales as readonly string[]).includes(locale)) return;

  cookies().set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  redirect(String(formData.get("path") || "/"));
}
