import { describe, it, expect } from "vitest";
import { ageOn, isAdult, isValidBirthDate, isProfileComplete } from "@/lib/profile";

describe("ageOn", () => {
  it("conta gli anni compiuti, non quelli iniziati", () => {
    // Compleanno non ancora arrivato nell'anno di riferimento.
    expect(ageOn("2000-12-31", new Date("2026-08-06T12:00:00Z"))).toBe(25);
    // Compleanno già passato.
    expect(ageOn("2000-01-01", new Date("2026-08-06T12:00:00Z"))).toBe(26);
  });

  it("considera compiuto il compleanno nel giorno stesso", () => {
    expect(ageOn("2008-08-06", new Date("2026-08-06T12:00:00Z"))).toBe(18);
    expect(ageOn("2008-08-07", new Date("2026-08-06T12:00:00Z"))).toBe(17);
  });

  it("gestisce il 29 febbraio senza spostare il compleanno", () => {
    expect(ageOn("2008-02-29", new Date("2026-02-28T12:00:00Z"))).toBe(17);
    expect(ageOn("2008-02-29", new Date("2026-03-01T12:00:00Z"))).toBe(18);
  });
});

describe("isAdult", () => {
  it("blocca chi non ha ancora compiuto 18 anni", () => {
    const today = new Date("2026-08-06T12:00:00Z");
    expect(isAdult("2008-08-06", today)).toBe(true);
    expect(isAdult("2008-08-07", today)).toBe(false);
    expect(isAdult("2015-01-01", today)).toBe(false);
  });
});

describe("isValidBirthDate", () => {
  it("accetta solo il formato YYYY-MM-DD", () => {
    expect(isValidBirthDate("1990-05-12")).toBe(true);
    expect(isValidBirthDate("12/05/1990")).toBe(false);
    expect(isValidBirthDate("1990-5-12")).toBe(false);
    expect(isValidBirthDate("")).toBe(false);
  });

  it("rifiuta date che rispettano il formato ma non esistono", () => {
    expect(isValidBirthDate("2026-02-31")).toBe(false);
    expect(isValidBirthDate("2026-13-01")).toBe(false);
    expect(isValidBirthDate("2025-02-29")).toBe(false); // 2025 non è bisestile
    expect(isValidBirthDate("2024-02-29")).toBe(true);
  });
});

describe("isProfileComplete", () => {
  const full = {
    first_name: "Angelo",
    last_name: "Bregu",
    birth_date: "1990-05-12",
  };

  it("è completo solo con tutti e tre i campi", () => {
    expect(isProfileComplete(full)).toBe(true);
    expect(isProfileComplete(null)).toBe(false);
    expect(isProfileComplete({ ...full, birth_date: null })).toBe(false);
    expect(isProfileComplete({ ...full, first_name: null })).toBe(false);
  });

  it("non considera validi i campi fatti di soli spazi", () => {
    expect(isProfileComplete({ ...full, first_name: "   " })).toBe(false);
    expect(isProfileComplete({ ...full, last_name: " " })).toBe(false);
  });
});
