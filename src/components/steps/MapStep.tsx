import type { Premortem, Risk } from '../../types';
import { CATEGORY_META } from '../../types';
import { exposure, exposurePct, band, BAND_META, riskiest } from '../../lib/score';
import { track, Events } from '../../analytics';
import StepHeader from './StepHeader';
import RiskMatrix from '../RiskMatrix';
import { Star, Target } from '../icons';

interface Props {
  pm: Premortem;
  setRisks: (risks: Risk[]) => void;
  stepIndex: number;
  totalSteps: number;
}

export default function MapStep({ pm, setRisks, stepIndex, totalSteps }: Props) {
  const sorted = [...pm.risks].sort(
    (a, b) => exposure(b) - exposure(a) || b.impact - a.impact
  );
  const starred = pm.risks.find((r) => r.starred);
  const auto = riskiest(pm.risks);
  const highlightId = starred?.id ?? auto?.id;

  function star(id: string) {
    const risk = pm.risks.find((r) => r.id === id);
    setRisks(pm.risks.map((r) => ({ ...r, starred: r.id === id ? !r.starred : false })));
    if (risk) {
      track(Events.riskiestStarred, {
        risk_title: risk.title,
        risk_category: risk.category,
        likelihood: risk.likelihood,
        impact: risk.impact,
        exposure_pct: exposurePct(risk),
        is_auto_flagged: risk.id === auto?.id,
        risk_rank: sorted.findIndex((r) => r.id === id) + 1,
      });
    }
  }

  return (
    <div className="animate-fade-up">
      <StepHeader
        index={stepIndex}
        total={totalSteps}
        eyebrow="Map & prioritise"
        title="Find the one that decides everything"
        subtitle="Likelihood times impact tells you where to spend your attention. The risks in the top-right are the ones worth testing before you write a line of code. Star your single riskiest assumption."
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        {/* Matrix */}
        <div className="card flex flex-col items-center p-6">
          <RiskMatrix risks={pm.risks} riskiestId={highlightId} onSelect={star} />
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <span key={key} className="flex items-center gap-1.5 text-xs text-ink-muted">
                <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
            ))}
          </div>
        </div>

        {/* Ranked list */}
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink">
            <Target width={16} height={16} className="text-ember-600" />
            Ranked by exposure
          </div>
          <ol className="space-y-2.5">
            {sorted.map((r, i) => {
              const meta = CATEGORY_META[r.category];
              const ex = exposurePct(r);
              const b = BAND_META[band(ex)];
              const isStar = r.id === starred?.id;
              const isAuto = !starred && r.id === auto?.id;
              return (
                <li
                  key={r.id}
                  className={[
                    'card flex items-center gap-3 p-3.5 transition-all',
                    isStar || isAuto ? 'ring-2 ring-ember-300' : '',
                  ].join(' ')}
                >
                  <span className="font-mono text-xs font-semibold text-ink-muted">
                    {i + 1}
                  </span>
                  <button
                    onClick={() => star(r.id)}
                    aria-label="Mark as riskiest assumption"
                    className={[
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all',
                      isStar
                        ? 'bg-ember-500 text-white'
                        : 'bg-paper-line text-ink-muted hover:bg-ember-100 hover:text-ember-600',
                    ].join(' ')}
                  >
                    <Star width={15} height={15} fill={isStar ? 'currentColor' : 'none'} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{r.title}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`chip ${meta.tone} px-2 py-0.5 text-[10px]`}>
                        {meta.label}
                      </span>
                      <span className="text-[11px] text-ink-muted">
                        L{r.likelihood} &times; I{r.impact}
                      </span>
                      {isAuto && (
                        <span className="text-[11px] font-semibold text-ember-600">
                          auto-flagged
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <div className={`text-sm font-bold ${b.text}`}>{ex}</div>
                    <div className="text-[10px] uppercase tracking-wide text-ink-muted">
                      {b.label}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {(starred || auto) && (
            <div className="mt-4 rounded-2xl border border-ember-200 bg-ember-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ember-700">
                Your riskiest assumption
              </p>
              <p className="mt-1.5 text-sm font-medium text-ink">
                {(starred ?? auto)!.title}
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                If you only test one thing before building, test this.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
