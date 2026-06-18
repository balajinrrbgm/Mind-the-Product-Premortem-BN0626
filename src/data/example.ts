import type { Premortem } from '../types';
import { uid } from '../lib/share';

/** A worked example so a first-time visitor instantly sees the value. */
export function examplePremortem(): Premortem {
  return {
    v: 1,
    name: 'StandupBot',
    oneLiner: 'An async daily standup that turns Slack updates into an auto-summarised status for managers.',
    audience: 'Engineering managers on distributed teams of 5\u201330 people',
    bet: 'Managers will trust an AI summary enough to skip the live standup meeting entirely.',
    headline:
      'Six months in, teams installed it, posted updates for two weeks, then quietly went back to their old standup. Nobody trusted the summary enough to act on it.',
    createdAt: new Date().toISOString(),
    risks: [
      {
        id: uid(),
        title: 'Managers don\u2019t trust an AI summary enough to skip the live meeting',
        category: 'desirability',
        likelihood: 4,
        impact: 5,
        starred: true,
        experiment: 'Wizard of Oz: hand-write the summary for 5 teams for two weeks and see if they drop the live standup.',
      },
      {
        id: uid(),
        title: 'People stop posting updates once the novelty wears off',
        category: 'desirability',
        likelihood: 4,
        impact: 4,
        experiment: 'Concierge test with 3 teams; track daily posting rate over 3 weeks.',
      },
      {
        id: uid(),
        title: 'The summary is hard to trust when updates are vague or contradictory',
        category: 'usability',
        likelihood: 3,
        impact: 4,
        experiment: '',
      },
      {
        id: uid(),
        title: 'LLM summaries are too unreliable to ship without review',
        category: 'feasibility',
        likelihood: 3,
        impact: 4,
        experiment: 'Riskiest-assumption prototype on 200 real anonymised standup threads.',
      },
      {
        id: uid(),
        title: 'Per-team LLM costs erode the margin at the $8/user price point',
        category: 'viability',
        likelihood: 3,
        impact: 4,
        experiment: 'Cost-per-action model across light and heavy teams.',
      },
    ],
  };
}
