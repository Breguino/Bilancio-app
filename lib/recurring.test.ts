import { describe, it, expect } from "vitest";
import { nextOccurrence } from "@/lib/recurring";

describe("nextOccurrence", () => {
  it("adds 7 days for a weekly recurrence, including across a month/year boundary", () => {
    expect(nextOccurrence("2026-01-28", "weekly")).toBe("2026-02-04");
    expect(nextOccurrence("2026-12-28", "weekly")).toBe("2027-01-04");
  });

  it("adds one month for a monthly recurrence in the simple case", () => {
    expect(nextOccurrence("2026-01-15", "monthly")).toBe("2026-02-15");
    expect(nextOccurrence("2026-12-15", "monthly")).toBe("2027-01-15");
  });

  it("clamps a monthly recurrence to the shorter month instead of overflowing", () => {
    // 31 gennaio + un mese non esiste come "31 febbraio": deve fermarsi
    // all'ultimo giorno di febbraio, non traboccare a marzo.
    expect(nextOccurrence("2026-01-31", "monthly")).toBe("2026-02-28");
    expect(nextOccurrence("2024-01-31", "monthly")).toBe("2024-02-29"); // 2024 è bisestile
  });

  it("adds one year for a yearly recurrence, clamping 29 February in a non-leap year", () => {
    expect(nextOccurrence("2026-06-15", "yearly")).toBe("2027-06-15");
    expect(nextOccurrence("2024-02-29", "yearly")).toBe("2025-02-28");
  });
});
