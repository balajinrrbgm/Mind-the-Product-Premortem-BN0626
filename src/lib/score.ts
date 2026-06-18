import type { Premortem, Risk, RiskCategory } from '../types';
import { CATEGORY_ORDER } from '../types';

/** Raw exposure for a single risk: likelihood × impact, range 1–25. */
export function exposure(r: Risk): number {
  return r.likelihood * r.impact;
}

/** Exposure on a friendly 0–100 scale. */
export function exposurePct(r: Risk): number {
  return Math.round((exposure(r) / 25) * 100);
}

export type ExposureBand = 'low' | 'moderate' | 'high' | 'critical';

export function band(value: number): ExposureBand {
  // value is on a 0–100 scale
  if (value >= 64) return 'critical';
  if (value >= 36) return 'high';
  if (value >= 16) return 'moderate';
  return 'low';
}

export const BAND_META: Record<
  ExposureBand,
  { label: string; text: string; bg: string; bar: string }
> = {
  low: { label: 'Low', text: 'text-sage-700', bg: 'bg-sage-50', bar: 'bg-sage-500' },
  moderate: { label: 'Moderate', text: 'text-amber-700', bg: 'bg-amber-50', bar: 'bg-amber-500' },
  high: { label: 'High', text: 'text-ember-700', bg: 'bg-ember-50', bar: 'bg-ember-500' },
  critical: { label: 'Critical', text: 'text-red-700', bg: 'bg-red-50', bar: 'bg-red-600' },
};

/** The single most dangerous assumption (highest exposure, ties broken by impact). */
export function riskiest(risks: Risk[]): Risk | undefined {
  if (risks.length === 0) return undefined;
  return [...risks].sort(
    (a, b) => exposure(b) - exposure(a) || b.impact - a.impact
  )[0];
}

export function sortedByExposure(risks: Risk[]): Risk[] {
  return [...risks].sort((a, b) => exposure(b) - exposure(a) || b.impact - a.impact);
}

function hasExperiment(r: Risk): boolean {
  return !!r.experiment && r.experiment.trim().length > 0;
}

export interface PremortemScore {
  /** Overall danger of the bet, 0–100. Higher = scarier. */
  exposureScore: number;
  exposureBand: ExposureBand;
  /** How much of the danger you have a plan to test, 0–100. Higher = safer to ship. */
  readiness: number;
  readinessBand: ExposureBand;
  riskCount: number;
  coveredCount: number;
  categoriesCovered: number;
  blindSpots: RiskCategory[];
}

/**
 * Pre-mortem readiness model.
 *
 * - exposureScore reflects how dangerous the *unmitigated* picture is, weighted
 *   toward the biggest risks (top risks dominate, the long tail matters less).
 * - readiness reflects how much of that exposure you have an experiment planned
 *   for, plus a small bonus for thinking across all four risk lenses.
 */
export function scorePremortem(pm: Premortem): PremortemScore {
  const risks = pm.risks;
  const riskCount = risks.length;

  if (riskCount === 0) {
    return {
      exposureScore: 0,
      exposureBand: 'low',
      readiness: 0,
      readinessBand: 'low',
      riskCount: 0,
      coveredCount: 0,
      categoriesCovered: 0,
      blindSpots: [...CATEGORY_ORDER],
    };
  }

  const sorted = sortedByExposure(risks);

  // Exposure: weighted blend that lets the top risks carry most of the signal.
  const weights = sorted.map((_, i) => 1 / (i + 1));
  const weightSum = weights.reduce((a, b) => a + b, 0);
  const weightedExposure =
    sorted.reduce((acc, r, i) => acc + exposurePct(r) * weights[i], 0) / weightSum;
  const exposureScore = Math.round(weightedExposure);

  // Readiness: exposure-weighted coverage by planned experiments.
  const totalExposure = risks.reduce((acc, r) => acc + exposure(r), 0);
  const coveredExposure = risks
    .filter(hasExperiment)
    .reduce((acc, r) => acc + exposure(r), 0);
  const coverage = totalExposure > 0 ? coveredExposure / totalExposure : 0;

  const presentCategories = new Set(risks.map((r) => r.category));
  const categoriesCovered = presentCategories.size;
  const thoroughness = categoriesCovered / CATEGORY_ORDER.length;

  const readiness = Math.round(100 * (0.8 * coverage + 0.2 * thoroughness));

  const blindSpots = CATEGORY_ORDER.filter((c) => !presentCategories.has(c));

  return {
    exposureScore,
    exposureBand: band(exposureScore),
    readiness,
    readinessBand: band(readiness),
    riskCount,
    coveredCount: risks.filter(hasExperiment).length,
    categoriesCovered,
    blindSpots,
  };
}

export function verdict(score: PremortemScore): { title: string; line: string } {
  if (score.riskCount === 0) {
    return {
      title: 'Nothing surfaced yet',
      line: 'Add the risks you can imagine. The ones you can name are the ones you can beat.',
    };
  }
  if (score.readiness >= 70) {
    return {
      title: 'Ship-ready thinking',
      line: 'You have a plan to test what matters most. Run the experiments, then build with conviction.',
    };
  }
  if (score.readiness >= 40) {
    return {
      title: 'Getting there',
      line: 'You have named the danger. Now attach an experiment to every high-exposure risk before you commit.',
    };
  }
  return {
    title: 'Build at your peril',
    line: 'You can see the cliff edge but have no plan to avoid it. De-risk your biggest assumptions first.',
  };
}
