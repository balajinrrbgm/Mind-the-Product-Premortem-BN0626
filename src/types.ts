export type RiskCategory = 'desirability' | 'usability' | 'feasibility' | 'viability';

export interface Risk {
  id: string;
  title: string;
  category: RiskCategory;
  /** 1 (unlikely) – 5 (almost certain) */
  likelihood: number;
  /** 1 (minor) – 5 (fatal) */
  impact: number;
  /** The de-risking experiment the team commits to next. */
  experiment?: string;
  /** Whether this risk has been chosen as the single riskiest assumption. */
  starred?: boolean;
}

export interface Premortem {
  /** Schema version, for forward-compatible share links. */
  v: number;
  /** What are we about to ship? */
  name: string;
  oneLiner: string;
  audience: string;
  /** The core bet — the thing that must be true for this to work. */
  bet: string;
  /** Step 2: the failure headline that puts you in the pessimist's seat. */
  headline: string;
  risks: Risk[];
  createdAt: string;
}

export const CATEGORY_META: Record<
  RiskCategory,
  { label: string; question: string; tone: string; dot: string; ring: string; hex: string }
> = {
  desirability: {
    label: 'Desirability',
    question: 'Do people actually want this?',
    tone: 'text-ember-700 bg-ember-50 border-ember-200',
    dot: 'bg-ember-500',
    ring: 'ring-ember-200',
    hex: '#f95816',
  },
  usability: {
    label: 'Usability',
    question: 'Can people figure out how to use it?',
    tone: 'text-violet-700 bg-violet-50 border-violet-200',
    dot: 'bg-violet-500',
    ring: 'ring-violet-200',
    hex: '#8b5cf6',
  },
  feasibility: {
    label: 'Feasibility',
    question: 'Can we actually build and run it?',
    tone: 'text-sky-700 bg-sky-50 border-sky-200',
    dot: 'bg-sky-500',
    ring: 'ring-sky-200',
    hex: '#0ea5e9',
  },
  viability: {
    label: 'Viability',
    question: 'Does it work for the business?',
    tone: 'text-sage-700 bg-sage-50 border-sage-200',
    dot: 'bg-sage-500',
    ring: 'ring-sage-200',
    hex: '#3d8463',
  },
};

export const CATEGORY_ORDER: RiskCategory[] = [
  'desirability',
  'usability',
  'feasibility',
  'viability',
];
