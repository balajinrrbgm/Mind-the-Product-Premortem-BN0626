import type { RiskCategory } from '../types';

export interface RiskSuggestion {
  title: string;
  category: RiskCategory;
  /** Lower-case keywords that make this risk more relevant to a given bet. */
  triggers: string[];
  /** Sensible starting estimates the user can adjust. */
  likelihood: number;
  impact: number;
}

/**
 * A curated library of the failure modes that actually kill products, organised
 * by the four classic product-risk lenses (Cagan). Each item carries trigger
 * keywords so the suggestion engine can surface the most relevant risks for the
 * specific thing the user is about to ship — no API call, fully offline.
 */
export const RISK_LIBRARY: RiskSuggestion[] = [
  // ---------------- DESIRABILITY ----------------
  {
    title: 'The problem is real, but not painful enough for anyone to change behaviour',
    category: 'desirability',
    triggers: [],
    likelihood: 4,
    impact: 5,
  },
  {
    title: 'People say they want it in interviews, but won\u2019t actually use it',
    category: 'desirability',
    triggers: ['survey', 'interview', 'research', 'feedback'],
    likelihood: 4,
    impact: 4,
  },
  {
    title: 'A free or already-installed alternative is "good enough"',
    category: 'desirability',
    triggers: ['tool', 'app', 'saas', 'productivity', 'spreadsheet', 'notion', 'excel'],
    likelihood: 4,
    impact: 4,
  },
  {
    title: 'We\u2019re building for ourselves, not the actual target user',
    category: 'desirability',
    triggers: ['internal', 'team', 'pm', 'designer', 'engineer'],
    likelihood: 3,
    impact: 4,
  },
  {
    title: 'The value only lands after heavy setup nobody will do',
    category: 'desirability',
    triggers: ['onboarding', 'import', 'integrate', 'connect', 'setup', 'configure'],
    likelihood: 3,
    impact: 4,
  },
  {
    title: 'It needs a critical mass of other users before it\u2019s useful (cold start)',
    category: 'desirability',
    triggers: ['social', 'community', 'marketplace', 'network', 'share', 'collaborate', 'chat'],
    likelihood: 4,
    impact: 5,
  },
  {
    title: 'The "wow" is a one-time novelty; there\u2019s no reason to come back',
    category: 'desirability',
    triggers: ['ai', 'generate', 'fun', 'game', 'toy', 'novelty'],
    likelihood: 3,
    impact: 4,
  },

  // ---------------- USABILITY ----------------
  {
    title: 'First-time users don\u2019t understand what to do on the first screen',
    category: 'usability',
    triggers: ['onboarding', 'dashboard', 'app', 'tool', 'web'],
    likelihood: 4,
    impact: 4,
  },
  {
    title: 'The core action takes too many steps to feel worth it',
    category: 'usability',
    triggers: ['workflow', 'form', 'flow', 'steps', 'wizard'],
    likelihood: 3,
    impact: 3,
  },
  {
    title: 'Empty states give no hint of the value or what to do next',
    category: 'usability',
    triggers: ['dashboard', 'list', 'feed', 'data', 'analytics'],
    likelihood: 3,
    impact: 3,
  },
  {
    title: 'Mobile / small-screen experience is broken or an afterthought',
    category: 'usability',
    triggers: ['mobile', 'app', 'consumer', 'web', 'responsive'],
    likelihood: 3,
    impact: 3,
  },
  {
    title: 'The output is hard to trust, interpret, or act on',
    category: 'usability',
    triggers: ['ai', 'report', 'score', 'analytics', 'insight', 'recommend'],
    likelihood: 3,
    impact: 4,
  },
  {
    title: 'Accessibility gaps lock out a chunk of real users',
    category: 'usability',
    triggers: ['consumer', 'public', 'web', 'gov', 'education', 'health'],
    likelihood: 2,
    impact: 3,
  },

  // ---------------- FEASIBILITY ----------------
  {
    title: 'The AI output is too unreliable to ship without a human in the loop',
    category: 'feasibility',
    triggers: ['ai', 'llm', 'gpt', 'generate', 'model', 'agent', 'ml'],
    likelihood: 4,
    impact: 4,
  },
  {
    title: 'Third-party API limits, costs, or downtime could sink the experience',
    category: 'feasibility',
    triggers: ['api', 'integrate', 'openai', 'anthropic', 'stripe', 'third-party', 'webhook'],
    likelihood: 3,
    impact: 4,
  },
  {
    title: 'Performance degrades badly with real-world data volume',
    category: 'feasibility',
    triggers: ['data', 'search', 'feed', 'scale', 'realtime', 'analytics'],
    likelihood: 3,
    impact: 4,
  },
  {
    title: 'We\u2019re underestimating the edge cases and error states',
    category: 'feasibility',
    triggers: ['form', 'upload', 'payment', 'import', 'integration', 'workflow'],
    likelihood: 4,
    impact: 3,
  },
  {
    title: 'The hardest 20% (the actual magic) is the part we haven\u2019t prototyped',
    category: 'feasibility',
    triggers: ['ai', 'realtime', 'sync', 'algorithm', 'matching', 'recommendation'],
    likelihood: 4,
    impact: 5,
  },
  {
    title: 'Ongoing maintenance / content / moderation will outpace the team',
    category: 'feasibility',
    triggers: ['content', 'community', 'ugc', 'marketplace', 'moderation', 'social'],
    likelihood: 3,
    impact: 3,
  },

  // ---------------- VIABILITY ----------------
  {
    title: 'No clear path to revenue — people won\u2019t pay for this',
    category: 'viability',
    triggers: ['saas', 'paid', 'subscription', 'pricing', 'b2b', 'business', 'monetize'],
    likelihood: 3,
    impact: 5,
  },
  {
    title: 'Unit economics don\u2019t work once AI / infra costs are real',
    category: 'viability',
    triggers: ['ai', 'llm', 'api', 'compute', 'infra', 'tokens', 'free'],
    likelihood: 3,
    impact: 5,
  },
  {
    title: 'Acquisition cost is higher than the value of a customer',
    category: 'viability',
    triggers: ['consumer', 'growth', 'marketing', 'ads', 'acquisition'],
    likelihood: 3,
    impact: 4,
  },
  {
    title: 'It cannibalises or conflicts with something the business already does',
    category: 'viability',
    triggers: ['internal', 'enterprise', 'platform', 'existing'],
    likelihood: 2,
    impact: 3,
  },
  {
    title: 'Legal, privacy, or compliance exposure we haven\u2019t accounted for',
    category: 'viability',
    triggers: ['data', 'health', 'finance', 'payment', 'children', 'privacy', 'gdpr', 'ai', 'personal'],
    likelihood: 3,
    impact: 5,
  },
  {
    title: 'A bigger incumbent can copy this in a weekend',
    category: 'viability',
    triggers: ['ai', 'feature', 'simple', 'wrapper', 'tool'],
    likelihood: 3,
    impact: 4,
  },
];

/**
 * Rank the library against the user's framing text and return the most relevant
 * suggestions, guaranteeing coverage across all four categories.
 */
export function suggestRisks(
  framingText: string,
  excludeTitles: Set<string>,
  perCategory = 3
): RiskSuggestion[] {
  const text = framingText.toLowerCase();
  const scored = RISK_LIBRARY.filter((r) => !excludeTitles.has(r.title)).map((r) => {
    const hits = r.triggers.filter((t) => text.includes(t)).length;
    // Base score keeps generic-but-deadly risks in play even with no keyword hits.
    const base = r.impact * 0.6 + r.likelihood * 0.4;
    return { suggestion: r, score: hits * 5 + base };
  });

  const byCategory = new Map<RiskCategory, typeof scored>();
  for (const s of scored) {
    const arr = byCategory.get(s.suggestion.category) ?? [];
    arr.push(s);
    byCategory.set(s.suggestion.category, arr);
  }

  const out: RiskSuggestion[] = [];
  for (const [, arr] of byCategory) {
    arr.sort((a, b) => b.score - a.score);
    out.push(...arr.slice(0, perCategory).map((x) => x.suggestion));
  }
  return out;
}
