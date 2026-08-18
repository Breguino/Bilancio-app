import { describe, it, expect } from "vitest";
import { passwordScore } from "@/lib/password-strength";

describe("passwordScore", () => {
  it("è zero solo per il campo vuoto", () => {
    expect(passwordScore("")).toBe(0);
    expect(passwordScore("a")).toBe(1);
  });

  it("resta al minimo sotto gli 8 caratteri, comunque sia composta", () => {
    // Il caso che conta: una password corta ma ricca non deve sembrare buona.
    expect(passwordScore("aB3!x")).toBe(1);
    expect(passwordScore("aB3!xy7")).toBe(1);
  });

  it("sale con la lunghezza", () => {
    expect(passwordScore("abcdefgh")).toBe(1);
    expect(passwordScore("abcdefghijkl")).toBe(2);
  });

  it("premia la combinazione di lettere e cifre", () => {
    expect(passwordScore("abcdefg1")).toBe(2);
    // Solo cifre non è una combinazione: niente punto.
    expect(passwordScore("12345678")).toBe(1);
  });

  it("premia i simboli", () => {
    expect(passwordScore("abcdefg!")).toBe(2);
    expect(passwordScore("abcdefg1!")).toBe(3);
  });

  it("arriva a 4 solo con lunghezza, misto e simboli", () => {
    expect(passwordScore("abcdefghijk1!")).toBe(4);
    expect(passwordScore("correcthorsebattery")).toBe(2);
  });

  it("non supera mai il massimo", () => {
    expect(passwordScore("aB3!".repeat(20))).toBe(4);
  });
});
