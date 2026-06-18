import type { Premortem } from '../../types';
import StepHeader from './StepHeader';

interface Props {
  pm: Premortem;
  patch: (p: Partial<Premortem>) => void;
  stepIndex: number;
  totalSteps: number;
}

export default function FrameStep({ pm, patch, stepIndex, totalSteps }: Props) {
  return (
    <div className="animate-fade-up">
      <StepHeader
        index={stepIndex}
        total={totalSteps}
        eyebrow="Frame the bet"
        title="What are you about to ship?"
        subtitle="Get specific. A pre-mortem on a vague idea produces vague risks. Name the thing, who it's for, and the single belief that has to be true for it to work."
      />

      <div className="card space-y-6 p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="field-label" htmlFor="pm-name">
              Product / feature name
            </label>
            <input
              id="pm-name"
              className="input"
              placeholder="e.g. StandupBot"
              value={pm.name}
              maxLength={80}
              onChange={(e) => patch({ name: e.target.value })}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="pm-audience">
              Who is it for?
            </label>
            <input
              id="pm-audience"
              className="input"
              placeholder="e.g. Engineering managers on distributed teams"
              value={pm.audience}
              maxLength={140}
              onChange={(e) => patch({ audience: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="pm-oneliner">
            In one line, what does it do?
          </label>
          <input
            id="pm-oneliner"
            className="input"
            placeholder="e.g. Turns async Slack updates into a manager-ready status summary"
            value={pm.oneLiner}
            maxLength={200}
            onChange={(e) => patch({ oneLiner: e.target.value })}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="pm-bet">
            The core bet
          </label>
          <textarea
            id="pm-bet"
            className="input min-h-[88px] resize-y"
            placeholder="The one thing that must be true for this to succeed. e.g. 'Managers will trust an AI summary enough to skip the live standup.'"
            value={pm.bet}
            maxLength={300}
            onChange={(e) => patch({ bet: e.target.value })}
          />
          <p className="mt-2 text-xs text-ink-muted">
            This is the assumption your whole product rests on. If it's wrong, nothing else
            matters.
          </p>
        </div>
      </div>
    </div>
  );
}
