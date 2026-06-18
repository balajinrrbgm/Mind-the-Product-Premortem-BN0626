import type { Premortem, Risk } from '../../types';
import { CATEGORY_META } from '../../types';
import { experimentsFor } from '../../data/experiments';
import { exposure, exposurePct, band, BAND_META } from '../../lib/score';
import { track, Events } from '../../analytics';
import StepHeader from './StepHeader';
import { Flask, Check } from '../icons';

interface Props {
  pm: Premortem;
  setRisks: (risks: Risk[]) => void;
  stepIndex: number;
  totalSteps: number;
}

export default function DeriskStep({
  pm,
  setRisks,
  stepIndex,
  totalSteps,
}: Props) {
  // Focus de-risking on the risks that actually matter: top exposure first.
  const sorted = [...pm.risks].sort(
    (a, b) => exposure(b) - exposure(a) || b.impact - a.impact
  );

  function setExperiment(id: string, experiment: string) {
    const risk = pm.risks.find((r) => r.id === id);
    setRisks(pm.risks.map((r) => (r.id === id ? { ...r, experiment } : r)));
    const isDeselect = experiment === '';
    const coveredAfter = pm.risks.filter((r) => {
      if (r.id === id) return experiment.trim().length > 0;
      return !!r.experiment && r.experiment.trim().length > 0;
    }).length;
    if (risk) {
      track(Events.experimentPicked, {
        experiment_name: isDeselect ? (risk.experiment || '') : experiment,
        risk_title: risk.title,
        risk_category: risk.category,
        risk_exposure_pct: exposurePct(risk),
        is_deselect: isDeselect,
        covered_count_after: coveredAfter,
      });
    }
  }

  return (
    <div className="animate-fade-up">
      <StepHeader
        index={stepIndex}
        total={totalSteps}
        eyebrow="Plan to de-risk"
        title="Attach the cheapest test that could prove you wrong"
        subtitle="You don't have to de-risk everything — just the assumptions big enough to matter. For each, pick the lightest experiment that would generate real evidence, then go run it."
      />

      <div className="space-y-4">
        {sorted.map((r) => {
          const meta = CATEGORY_META[r.category];
          const ex = exposurePct(r);
          const b = BAND_META[band(ex)];
          const options = experimentsFor(r.category);
          const hasPlan = !!r.experiment && r.experiment.trim().length > 0;

          return (
            <div key={r.id} className="card p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={`chip ${meta.tone} px-2 py-0.5 text-[10px]`}>
                      {meta.label}
                    </span>
                    <span className={`text-xs font-semibold ${b.text}`}>
                      Exposure {ex} &middot; {b.label}
                    </span>
                    {hasPlan && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-sage-600">
                        <Check width={13} height={13} /> de-risk planned
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-medium leading-relaxed text-ink">{r.title}</p>
                </div>
              </div>

              <div className="mt-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
                  <Flask width={14} height={14} className="text-ink" />
                  Recommended experiments
                </p>
                <div className="flex flex-wrap gap-2">
                  {options.slice(0, 4).map((e) => {
                    const plan = `${e.name} — ${e.how}`;
                    const active = r.experiment === plan;
                    return (
                      <button
                        key={e.name}
                        title={`${e.how} (signal: ${e.signal})`}
                        onClick={() => setExperiment(r.id, active ? '' : plan)}
                        className={[
                          'chip',
                          active
                            ? 'border-sage-400 bg-sage-50 text-sage-700'
                            : 'border-paper-line bg-paper-card text-ink-muted hover:border-ink/30 hover:text-ink',
                        ].join(' ')}
                      >
                        {active && <Check width={12} height={12} />}
                        {e.name}
                        <span className="ml-1 hidden text-[10px] text-ink-muted/70 sm:inline">
                          · {e.effort}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <textarea
                  className="input mt-3 min-h-[64px] resize-y text-sm"
                  placeholder="Or describe your own experiment. What will you do, and what result would change your mind?"
                  value={r.experiment ?? ''}
                  onChange={(e) => setRisks(
                    pm.risks.map((x) => (x.id === r.id ? { ...x, experiment: e.target.value } : x))
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
