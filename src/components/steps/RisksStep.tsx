import { useMemo, useState } from 'react';
import type { Premortem, Risk, RiskCategory } from '../../types';
import { CATEGORY_META, CATEGORY_ORDER } from '../../types';
import { suggestRisks } from '../../data/suggestions';
import { uid } from '../../lib/share';
import StepHeader from './StepHeader';
import RatingDots from '../RatingDots';
import { Plus, Close, Spark } from '../icons';

interface Props {
  pm: Premortem;
  setRisks: (risks: Risk[]) => void;
  onSuggestionUsed: () => void;
  stepIndex: number;
  totalSteps: number;
}

export default function RisksStep({
  pm,
  setRisks,
  onSuggestionUsed,
  stepIndex,
  totalSteps,
}: Props) {
  const [draftTitle, setDraftTitle] = useState('');
  const [draftCat, setDraftCat] = useState<RiskCategory>('desirability');

  const framingText = `${pm.name} ${pm.oneLiner} ${pm.audience} ${pm.bet} ${pm.headline}`;
  const existingTitles = useMemo(
    () => new Set(pm.risks.map((r) => r.title)),
    [pm.risks]
  );
  const suggestions = useMemo(
    () => suggestRisks(framingText, existingTitles, 2),
    [framingText, existingTitles]
  );

  function addRisk(partial: Partial<Risk> & { title: string; category: RiskCategory }) {
    const risk: Risk = {
      id: uid(),
      likelihood: 3,
      impact: 3,
      ...partial,
    };
    setRisks([...pm.risks, risk]);
  }

  function addDraft() {
    const title = draftTitle.trim();
    if (!title) return;
    addRisk({ title, category: draftCat });
    setDraftTitle('');
  }

  function updateRisk(id: string, p: Partial<Risk>) {
    setRisks(pm.risks.map((r) => (r.id === id ? { ...r, ...p } : r)));
  }

  function removeRisk(id: string) {
    setRisks(pm.risks.filter((r) => r.id !== id));
  }

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: pm.risks.filter((r) => r.category === cat),
  }));

  return (
    <div className="animate-fade-up">
      <StepHeader
        index={stepIndex}
        total={totalSteps}
        eyebrow="Surface the risks"
        title="Every way this could die"
        subtitle="Work the four lenses. For each, ask the blunt question and write down what could go wrong. Aim for at least one risk per lens — blind spots are where products go to die."
      />

      {/* Add a risk */}
      <div className="card mb-6 p-5 sm:p-6">
        <label className="field-label">Add a risk</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="input flex-1"
            placeholder="What could go wrong?"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addDraft();
              }
            }}
          />
          <select
            className="input sm:w-52"
            value={draftCat}
            onChange={(e) => setDraftCat(e.target.value as RiskCategory)}
            aria-label="Risk lens"
          >
            {CATEGORY_ORDER.map((c) => (
              <option key={c} value={c}>
                {CATEGORY_META[c].label}
              </option>
            ))}
          </select>
          <button className="btn-primary sm:px-5" onClick={addDraft} disabled={!draftTitle.trim()}>
            <Plus width={16} height={16} /> Add
          </button>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-ink-muted">
              <Spark width={14} height={14} className="text-ember-500" />
              Suggested for &ldquo;{pm.name.trim() || 'your product'}&rdquo; &mdash; tap to add
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s.title}
                  className={`chip ${CATEGORY_META[s.category].tone} hover:-translate-y-0.5 hover:shadow-soft`}
                  onClick={() => {
                    addRisk({
                      title: s.title,
                      category: s.category,
                      likelihood: s.likelihood,
                      impact: s.impact,
                    });
                    onSuggestionUsed();
                  }}
                >
                  <Plus width={12} height={12} />
                  {s.title}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Risk list grouped by lens */}
      <div className="space-y-6">
        {grouped.map(({ cat, items }) => {
          const meta = CATEGORY_META[cat];
          return (
            <div key={cat}>
              <div className="mb-2 flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                <h3 className="text-sm font-bold text-ink">{meta.label}</h3>
                <span className="text-xs text-ink-muted">{meta.question}</span>
                {items.length === 0 && (
                  <span className="ml-auto text-xs font-medium text-ember-600">
                    blind spot
                  </span>
                )}
              </div>

              {items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-paper-line px-4 py-5 text-center text-sm text-ink-muted/70">
                  Nothing here yet. What could go wrong with {meta.label.toLowerCase()}?
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((r) => (
                    <div key={r.id} className="card animate-pop p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <p className="flex-1 text-sm font-medium leading-relaxed text-ink">
                          {r.title}
                        </p>
                        <button
                          className="btn-ghost -mr-2 -mt-2 h-8 w-8 rounded-full p-0"
                          aria-label="Remove risk"
                          onClick={() => removeRisk(r.id)}
                        >
                          <Close width={16} height={16} />
                        </button>
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <RatingDots
                          label="Likelihood"
                          value={r.likelihood}
                          onChange={(v) => updateRisk(r.id, { likelihood: v })}
                          hint={['Unlikely', 'Almost certain']}
                          accent={meta.dot}
                        />
                        <RatingDots
                          label="Impact if it happens"
                          value={r.impact}
                          onChange={(v) => updateRisk(r.id, { impact: v })}
                          hint={['Minor', 'Fatal']}
                          accent={meta.dot}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
