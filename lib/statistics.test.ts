import { describe, it, expect } from "vitest";
import {
  mean,
  sampleStdDev,
  tCritical95,
  confidenceInterval95,
  linearRegression,
  zScoreOutliers,
} from "@/lib/statistics";

// Questo è il modulo che il sito mette in prima pagina — la previsione, la
// media, l'intervallo di confidenza — e fino a qui non aveva un test. I
// numeri attesi sotto sono calcolati a mano dalle definizioni, non copiati
// da un'esecuzione del codice: un test che ricopia l'output non si accorge
// se l'output è sbagliato.

describe("mean", () => {
  it("averages a plain list", () => {
    expect(mean([2, 4, 4, 4, 5, 5, 7, 9])).toBe(5);
    expect(mean([-3, 3])).toBe(0);
    expect(mean([7])).toBe(7);
  });

  // Non è raggiungibile oggi (l'unico punto che la chiama passa sempre cinque
  // valori), ma è il bordo della funzione: chi la riusa deve sapere che non
  // si difende da sola, come fanno invece le altre qui sotto.
  it("returns NaN for an empty list instead of pretending the mean is zero", () => {
    expect(mean([])).toBeNaN();
  });
});

describe("sampleStdDev", () => {
  it("divides by n-1, not by n", () => {
    // Somma degli scarti al quadrato = 32. Su 8 valori la popolazione darebbe
    // sqrt(32/8) = 2; il campione deve dare sqrt(32/7) = 2,1380…
    expect(sampleStdDev([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2.1380899353, 8);
  });

  it("is zero when every value is identical", () => {
    expect(sampleStdDev([5, 5, 5, 5])).toBe(0);
  });

  it("returns 0 for fewer than two values, where n-1 would be a division by zero", () => {
    expect(sampleStdDev([42])).toBe(0);
    expect(sampleStdDev([])).toBe(0);
  });
});

describe("tCritical95", () => {
  it("reads the table for 1 to 30 degrees of freedom", () => {
    expect(tCritical95(1)).toBe(12.706);
    expect(tCritical95(4)).toBe(2.776);
    expect(tCritical95(30)).toBe(2.042);
  });

  it("falls back to the normal approximation above 30", () => {
    expect(tCritical95(31)).toBe(1.96);
    expect(tCritical95(1000)).toBe(1.96);
  });

  it("clamps below 1 to the widest value in the table", () => {
    expect(tCritical95(0)).toBe(12.706);
    expect(tCritical95(-5)).toBe(12.706);
  });
});

describe("confidenceInterval95", () => {
  it("builds the interval around the mean from the standard error", () => {
    // [10,12,14,16,18]: media 14, sd = sqrt(10), se = sqrt(10)/sqrt(5) =
    // sqrt(2) = 1,41421…, t(4) = 2,776 → margine 3,92585…
    const ic = confidenceInterval95([10, 12, 14, 16, 18]);
    expect(ic).not.toBeNull();
    expect(ic!.mean).toBe(14);
    expect(ic!.marginOfError).toBeCloseTo(3.9258568491, 8);
    expect(ic!.lower).toBeCloseTo(10.0741431509, 8);
    expect(ic!.upper).toBeCloseTo(17.9258568491, 8);
  });

  it("has zero width when the values never move", () => {
    const ic = confidenceInterval95([7, 7, 7, 7]);
    expect(ic!.marginOfError).toBe(0);
    expect(ic!.lower).toBe(7);
    expect(ic!.upper).toBe(7);
  });

  it("returns null below two values, where there is no dispersion to measure", () => {
    expect(confidenceInterval95([3])).toBeNull();
    expect(confidenceInterval95([])).toBeNull();
  });
});

describe("linearRegression", () => {
  it("recovers slope and intercept exactly on a perfect line", () => {
    // y = 3x + 1
    const r = linearRegression([
      { x: 0, y: 1 },
      { x: 1, y: 4 },
      { x: 2, y: 7 },
      { x: 3, y: 10 },
    ]);
    expect(r!.slope).toBeCloseTo(3, 10);
    expect(r!.intercept).toBeCloseTo(1, 10);
    expect(r!.r2).toBeCloseTo(1, 10);
  });

  it("computes slope, intercept and r² on scattered points", () => {
    // (0,1) (1,3) (2,2) (3,5): num 5,5 su den 5 → pendenza 1,1;
    // intercetta 2,75 − 1,1·1,5 = 1,1; ssRes 2,7 su ssTot 8,75 → r² 0,69142…
    const r = linearRegression([
      { x: 0, y: 1 },
      { x: 1, y: 3 },
      { x: 2, y: 2 },
      { x: 3, y: 5 },
    ]);
    expect(r!.slope).toBeCloseTo(1.1, 10);
    expect(r!.intercept).toBeCloseTo(1.1, 10);
    expect(r!.r2).toBeCloseTo(0.69142857, 8);
  });

  it("goes downhill with a negative slope", () => {
    const r = linearRegression([
      { x: 0, y: 10 },
      { x: 1, y: 8 },
      { x: 2, y: 6 },
    ]);
    expect(r!.slope).toBeCloseTo(-2, 10);
    expect(r!.intercept).toBeCloseTo(10, 10);
  });

  it("calls r² one when the line is flat, since there is nothing left to explain", () => {
    const r = linearRegression([
      { x: 0, y: 4 },
      { x: 1, y: 4 },
      { x: 2, y: 4 },
    ]);
    expect(r!.slope).toBe(0);
    expect(r!.r2).toBe(1);
  });

  it("returns null instead of dividing by zero when every x is the same", () => {
    expect(
      linearRegression([
        { x: 2, y: 1 },
        { x: 2, y: 5 },
      ])
    ).toBeNull();
  });

  it("returns null below two points, where a line is not determined", () => {
    expect(linearRegression([{ x: 1, y: 1 }])).toBeNull();
    expect(linearRegression([])).toBeNull();
  });
});

describe("zScoreOutliers", () => {
  const riga = (id: string, amount: number) => ({ id, amount });

  it("flags the value beyond two standard deviations and leaves the rest alone", () => {
    // Nove volte 10 e una volta 100: media 19, sd 28,46 → z del 100 è 2,846.
    const valori = [
      ...Array.from({ length: 9 }, (_, i) => riga(`n${i}`, 10)),
      riga("fuori", 100),
    ];
    const fuori = zScoreOutliers(valori);
    expect(fuori).toHaveLength(1);
    expect(fuori[0].id).toBe("fuori");
    expect(fuori[0].zScore).toBeCloseTo(2.84605, 5);
  });

  it("respects a custom threshold", () => {
    const valori = [
      ...Array.from({ length: 9 }, (_, i) => riga(`n${i}`, 10)),
      riga("fuori", 100),
    ];
    expect(zScoreOutliers(valori, 3)).toHaveLength(0);
    expect(zScoreOutliers(valori, 1)).toHaveLength(1);
  });

  it("finds nothing when every amount is identical, instead of dividing by a zero deviation", () => {
    expect(zScoreOutliers([riga("a", 5), riga("b", 5), riga("c", 5), riga("d", 5)])).toEqual([]);
  });

  it("stays quiet below four values, too few to call anything anomalous", () => {
    expect(zScoreOutliers([riga("a", 1), riga("b", 1), riga("c", 900)])).toEqual([]);
  });

  it("keeps the original fields alongside the score", () => {
    const valori = [
      ...Array.from({ length: 9 }, (_, i) => ({ id: `n${i}`, amount: 10, nota: "tenuta" })),
      { id: "fuori", amount: 100, nota: "tenuta" },
    ];
    expect(zScoreOutliers(valori)[0]).toMatchObject({ id: "fuori", amount: 100, nota: "tenuta" });
  });
});
