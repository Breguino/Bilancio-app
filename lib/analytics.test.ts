import { afterEach, describe, expect, it } from "vitest";
import { gaMeasurementId } from "./analytics";

const ambienteIniziale = { ...process.env };

afterEach(() => {
  process.env = { ...ambienteIniziale };
});

describe("gaMeasurementId", () => {
  it("in produzione usa l'identificativo del sito", () => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    process.env.VERCEL_ENV = "production";
    expect(gaMeasurementId()).toBe("G-95TC112GPY");
  });

  // Le visite fatte mentre si sviluppa, o su un'anteprima di un ramo, non
  // devono finire nelle statistiche del sito vero.
  it("non misura niente fuori dalla produzione", () => {
    delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    for (const env of ["preview", "development", undefined]) {
      if (env === undefined) delete process.env.VERCEL_ENV;
      else process.env.VERCEL_ENV = env;
      expect(gaMeasurementId()).toBeUndefined();
    }
  });

  it("la variabile d'ambiente ha la precedenza, in qualsiasi ambiente", () => {
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-ALTRO123";
    process.env.VERCEL_ENV = "production";
    expect(gaMeasurementId()).toBe("G-ALTRO123");

    process.env.VERCEL_ENV = "preview";
    expect(gaMeasurementId()).toBe("G-ALTRO123");
  });

  it("una variabile vuota o di soli spazi non conta come impostata", () => {
    process.env.VERCEL_ENV = "production";
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "   ";
    expect(gaMeasurementId()).toBe("G-95TC112GPY");
  });
});
