interface RatingDotsProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: [string, string];
  accent?: string;
}

/** A 1–5 selector rendered as a compact, tactile row of dots. */
export default function RatingDots({
  label,
  value,
  onChange,
  hint,
  accent = 'bg-ink',
}: RatingDotsProps) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="field-label mb-1.5">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-ink">{value}/5</span>
      </div>
      <div className="flex gap-1.5" role="radiogroup" aria-label={label}>
        {[1, 2, 3, 4, 5].map((n) => {
          const active = n <= value;
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={n === value}
              aria-label={`${label} ${n}`}
              onClick={() => onChange(n)}
              className={[
                'h-7 flex-1 rounded-lg transition-all duration-150 hover:scale-[1.03]',
                active ? accent : 'bg-paper-line',
              ].join(' ')}
            />
          );
        })}
      </div>
      {hint && (
        <div className="mt-1 flex justify-between text-[11px] text-ink-muted/70">
          <span>{hint[0]}</span>
          <span>{hint[1]}</span>
        </div>
      )}
    </div>
  );
}
