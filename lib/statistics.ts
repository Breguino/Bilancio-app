export function mean(values: number[]): number {
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export function sampleStdDev(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  const variance = values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

// Valori critici t (bicodale, 95%) per gradi di libertà 1-30; oltre si usa
// l'approssimazione normale (1.96), come da tavole statistiche standard.
const T_TABLE_95: Record<number, number> = {
  1: 12.706, 2: 4.303, 3: 3.182, 4: 2.776, 5: 2.571, 6: 2.447, 7: 2.365, 8: 2.306,
  9: 2.262, 10: 2.228, 11: 2.201, 12: 2.179, 13: 2.16, 14: 2.145, 15: 2.131,
  16: 2.12, 17: 2.11, 18: 2.101, 19: 2.093, 20: 2.086, 21: 2.08, 22: 2.074,
  23: 2.069, 24: 2.064, 25: 2.06, 26: 2.056, 27: 2.052, 28: 2.048, 29: 2.045, 30: 2.042,
};

export function tCritical95(df: number): number {
  if (df < 1) return T_TABLE_95[1];
  if (df > 30) return 1.96;
  return T_TABLE_95[df];
}

export function confidenceInterval95(
  values: number[]
): { mean: number; marginOfError: number; lower: number; upper: number } | null {
  if (values.length < 2) return null;
  const m = mean(values);
  const sd = sampleStdDev(values);
  const se = sd / Math.sqrt(values.length);
  const margin = tCritical95(values.length - 1) * se;
  return { mean: m, marginOfError: margin, lower: m - margin, upper: m + margin };
}

export function linearRegression(
  points: { x: number; y: number }[]
): { slope: number; intercept: number; r2: number } | null {
  const n = points.length;
  if (n < 2) return null;
  const xMean = mean(points.map((p) => p.x));
  const yMean = mean(points.map((p) => p.y));

  let num = 0;
  let den = 0;
  for (const p of points) {
    num += (p.x - xMean) * (p.y - yMean);
    den += (p.x - xMean) ** 2;
  }
  if (den === 0) return null;

  const slope = num / den;
  const intercept = yMean - slope * xMean;

  let ssRes = 0;
  let ssTot = 0;
  for (const p of points) {
    const predicted = intercept + slope * p.x;
    ssRes += (p.y - predicted) ** 2;
    ssTot += (p.y - yMean) ** 2;
  }
  const r2 = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { slope, intercept, r2 };
}

export function zScoreOutliers<T extends { id: string; amount: number }>(
  values: T[],
  threshold = 2
): (T & { zScore: number })[] {
  if (values.length < 4) return [];
  const amounts = values.map((v) => v.amount);
  const m = mean(amounts);
  const sd = sampleStdDev(amounts);
  if (sd === 0) return [];
  return values
    .map((v) => ({ ...v, zScore: (v.amount - m) / sd }))
    .filter((v) => Math.abs(v.zScore) > threshold);
}
