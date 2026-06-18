import type { Premortem } from '../types';
import { CATEGORY_META } from '../types';
import { exposurePct, scorePremortem, riskiest, sortedByExposure, verdict } from './score';

/** Render the pre-mortem as a clean, shareable Markdown report. */
export function toMarkdown(pm: Premortem): string {
  const score = scorePremortem(pm);
  const v = verdict(score);
  const top = riskiest(pm.risks);
  const lines: string[] = [];

  lines.push(`# Pre-mortem: ${pm.name || 'Untitled'}`);
  lines.push('');
  if (pm.oneLiner) lines.push(`> ${pm.oneLiner}`);
  if (pm.audience) lines.push(`**For:** ${pm.audience}`);
  if (pm.bet) lines.push(`**The bet:** ${pm.bet}`);
  lines.push('');

  lines.push('## Readiness');
  lines.push('');
  lines.push(`- **Verdict:** ${v.title} — ${v.line}`);
  lines.push(`- **Exposure:** ${score.exposureScore}/100 (${score.exposureBand})`);
  lines.push(`- **Readiness to ship:** ${score.readiness}/100`);
  lines.push(
    `- **Coverage:** ${score.coveredCount}/${score.riskCount} risks have a de-risking plan`
  );
  if (score.blindSpots.length > 0) {
    lines.push(
      `- **Blind spots:** ${score.blindSpots.map((b) => CATEGORY_META[b].label).join(', ')}`
    );
  }
  lines.push('');

  if (pm.headline) {
    lines.push('## The failure we imagined');
    lines.push('');
    lines.push(`> ${pm.headline}`);
    lines.push('');
  }

  if (top) {
    lines.push('## Riskiest assumption');
    lines.push('');
    lines.push(`**${top.title}**`);
    lines.push('');
    lines.push(
      `Exposure ${exposurePct(top)}/100 · ${CATEGORY_META[top.category].label} · likelihood ${top.likelihood}/5 · impact ${top.impact}/5`
    );
    if (top.experiment) lines.push(`\n_Next: ${top.experiment}_`);
    lines.push('');
  }

  lines.push('## All risks (ranked by exposure)');
  lines.push('');
  lines.push('| # | Risk | Lens | L | I | Exposure | De-risk plan |');
  lines.push('|---|------|------|---|---|----------|--------------|');
  sortedByExposure(pm.risks).forEach((r, i) => {
    const cell = (s: string) => s.replace(/\|/g, '\\|').replace(/\n/g, ' ');
    lines.push(
      `| ${i + 1} | ${cell(r.title)} | ${CATEGORY_META[r.category].label} | ${r.likelihood} | ${r.impact} | ${exposurePct(r)} | ${cell(r.experiment || '—')} |`
    );
  });
  lines.push('');
  lines.push('---');
  lines.push('_Generated with Premortem — kill your idea before it kills your roadmap._');

  return lines.join('\n');
}
