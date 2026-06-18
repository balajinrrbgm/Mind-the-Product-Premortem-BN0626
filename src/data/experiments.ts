import type { RiskCategory } from '../types';

export interface Experiment {
  name: string;
  /** One line on how to run it. */
  how: string;
  /** Which risk lenses this experiment is good at attacking. */
  categories: RiskCategory[];
  effort: 'hours' | 'days' | 'a week';
  /** What a pass looks like. */
  signal: string;
}

/**
 * A toolbox of lightweight, evidence-generating experiments — the cheapest ways
 * to learn whether a risk is real before you commit engineering time.
 */
export const EXPERIMENT_LIBRARY: Experiment[] = [
  {
    name: 'Fake door test',
    how: 'Add the button/feature with no backend; measure how many people click and try to use it.',
    categories: ['desirability'],
    effort: 'hours',
    signal: 'A meaningful click-through rate from real, unprompted users.',
  },
  {
    name: 'Landing page smoke test',
    how: 'Put up a single page describing the value, with a "Get started" CTA and an email capture.',
    categories: ['desirability', 'viability'],
    effort: 'hours',
    signal: 'Sign-up rate well above a dead-flat baseline from targeted traffic.',
  },
  {
    name: 'Concierge test',
    how: 'Deliver the outcome manually, by hand, for a handful of real users before building anything.',
    categories: ['desirability', 'feasibility'],
    effort: 'days',
    signal: 'Users come back and ask for it again — and value the result.',
  },
  {
    name: 'Wizard of Oz',
    how: 'Show a real-looking product UI, but a human secretly powers the "magic" behind the scenes.',
    categories: ['feasibility', 'usability', 'desirability'],
    effort: 'days',
    signal: 'Users complete the core task and trust the output.',
  },
  {
    name: 'Five-user usability test',
    how: 'Watch five target users attempt the core task on a clickable prototype. Say nothing; just observe.',
    categories: ['usability'],
    effort: 'days',
    signal: '4 of 5 reach the goal without help or confusion.',
  },
  {
    name: 'Riskiest-assumption prototype',
    how: 'Build only the hardest 20% (the actual magic) end-to-end with throwaway code.',
    categories: ['feasibility'],
    effort: 'a week',
    signal: 'The core technical bet works reliably on realistic inputs.',
  },
  {
    name: 'Pricing / willingness-to-pay probe',
    how: 'Use a Van Westendorp survey, a paywall, or a pre-order to test if people will actually pay.',
    categories: ['viability'],
    effort: 'days',
    signal: 'Real payment intent (cards entered or pre-orders), not just "sounds fair".',
  },
  {
    name: 'Cost-per-action model',
    how: 'Estimate real API/infra cost per active user against plausible revenue per user.',
    categories: ['viability', 'feasibility'],
    effort: 'hours',
    signal: 'Margin stays positive at expected usage, even at the high end.',
  },
  {
    name: 'Customer interviews (problem-first)',
    how: 'Interview 5\u201310 target users about the problem and their current workaround — not your solution.',
    categories: ['desirability', 'usability'],
    effort: 'days',
    signal: 'They describe the pain unprompted and have hacked together a workaround.',
  },
  {
    name: 'Competitive teardown',
    how: 'Map how today\u2019s alternatives (including "do nothing" and spreadsheets) already solve this.',
    categories: ['desirability', 'viability'],
    effort: 'hours',
    signal: 'A clear, defensible reason a user would switch to you.',
  },
  {
    name: 'Data spike / volume test',
    how: 'Run the core flow against production-scale data to expose performance and edge cases early.',
    categories: ['feasibility'],
    effort: 'days',
    signal: 'Acceptable latency and no fatal edge cases at realistic volume.',
  },
  {
    name: 'Compliance / privacy review',
    how: 'Walk the data flow past a legal/privacy lens before collecting anything sensitive.',
    categories: ['viability'],
    effort: 'days',
    signal: 'No blocking legal exposure; a clear data-handling plan.',
  },
];

/** Suggest the experiments best suited to attacking a given risk category. */
export function experimentsFor(category: RiskCategory): Experiment[] {
  const primary = EXPERIMENT_LIBRARY.filter((e) => e.categories[0] === category);
  const secondary = EXPERIMENT_LIBRARY.filter(
    (e) => e.categories.includes(category) && e.categories[0] !== category
  );
  return [...primary, ...secondary];
}
