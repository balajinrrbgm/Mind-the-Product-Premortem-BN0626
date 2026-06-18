import type { Premortem } from '../../types';
import StepHeader from './StepHeader';
import { Skull } from '../icons';

interface Props {
  pm: Premortem;
  patch: (p: Partial<Premortem>) => void;
  stepIndex: number;
  totalSteps: number;
}

export default function FailureStep({ pm, patch, stepIndex, totalSteps }: Props) {
  const thing = pm.name.trim() || 'it';

  return (
    <div className="animate-fade-up">
      <StepHeader
        index={stepIndex}
        total={totalSteps}
        eyebrow="Imagine the failure"
        title="Fast-forward six months. It failed."
        subtitle="This is the move that makes a pre-mortem work. Don't ask whether it will fail — assume it already did. Your brain is far better at explaining a known outcome than predicting an uncertain one."
      />

      <div className="card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-paper-line bg-ink px-6 py-4 text-paper sm:px-8">
          <Skull width={20} height={20} className="text-ember-400" />
          <p className="text-sm font-medium">
            It&rsquo;s six months from now. {thing} shipped &mdash; and it was a flop.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <label className="field-label" htmlFor="pm-headline">
            Write the post-mortem headline
          </label>
          <textarea
            id="pm-headline"
            className="input min-h-[140px] resize-y font-serif text-lg leading-relaxed"
            placeholder="What does the story of the failure say? Be brutal and specific. e.g. 'Teams installed it, used it for two weeks, then quietly went back to their old standup. Nobody trusted the summary enough to act on it.'"
            value={pm.headline}
            onChange={(e) => patch({ headline: e.target.value })}
          />

          <div className="mt-5 rounded-2xl bg-paper-line/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
              If you&rsquo;re stuck, finish one of these
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-muted">
              <li>&ldquo;Users showed up once, but never&hellip;&rdquo;</li>
              <li>&ldquo;It technically worked, but people couldn&rsquo;t&hellip;&rdquo;</li>
              <li>&ldquo;We could never make the numbers work because&hellip;&rdquo;</li>
              <li>&ldquo;The whole thing fell apart the moment&hellip;&rdquo;</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
