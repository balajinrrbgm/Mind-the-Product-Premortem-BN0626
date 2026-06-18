import { Check } from './icons';

export interface StepDef {
  key: string;
  label: string;
}

interface StepperProps {
  steps: StepDef[];
  current: number;
  maxReached: number;
  onGo: (i: number) => void;
}

export default function Stepper({ steps, current, maxReached, onGo }: StepperProps) {
  return (
    <nav aria-label="Progress" className="w-full">
      <ol className="flex items-center gap-1 sm:gap-2">
        {steps.map((s, i) => {
          const done = i < current;
          const active = i === current;
          const reachable = i <= maxReached;
          return (
            <li key={s.key} className="flex flex-1 items-center gap-1 sm:gap-2">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onGo(i)}
                className={[
                  'group flex items-center gap-2 rounded-full py-1 pl-1 pr-1 sm:pr-3 transition-colors',
                  reachable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50',
                ].join(' ')}
              >
                <span
                  className={[
                    'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all',
                    done
                      ? 'bg-sage-500 text-white'
                      : active
                        ? 'bg-ink text-paper ring-4 ring-ink/10'
                        : 'bg-paper-line text-ink-muted',
                  ].join(' ')}
                >
                  {done ? <Check width={14} height={14} /> : i + 1}
                </span>
                <span
                  className={[
                    'hidden text-xs font-semibold sm:inline',
                    active ? 'text-ink' : 'text-ink-muted',
                  ].join(' ')}
                >
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && (
                <span
                  className={[
                    'h-px flex-1 transition-colors',
                    i < current ? 'bg-sage-400' : 'bg-paper-line',
                  ].join(' ')}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
