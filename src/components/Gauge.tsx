import { BAND_META, band } from '../lib/score';

interface GaugeProps {
  label: string;
  value: number; // 0–100
  caption?: string;
  /** When true the gauge is "good when high" (readiness). Otherwise high = bad. */
  invert?: boolean;
}

/** A horizontal gauge with an animated fill and a band label. */
export default function Gauge({ label, value, caption, invert }: GaugeProps) {
  const b = band(value);
  const meta = BAND_META[b];
  // For readiness, a high value is good, so flip the colour mapping.
  const barColor = invert
    ? value >= 64
      ? 'bg-sage-500'
      : value >= 36
        ? 'bg-amber-500'
        : 'bg-ember-500'
    : meta.bar;
  const labelText = invert
    ? value >= 64
      ? 'Strong'
      : value >= 36
        ? 'Partial'
        : 'Thin'
    : meta.label;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between">
        <span className="field-label mb-0">{label}</span>
        <span className="font-mono text-sm font-semibold text-ink">
          {value}
          <span className="text-ink-muted/60">/100</span>
        </span>
      </div>
      <div className="h-3 w-full overflow-hidden rounded-full bg-paper-line">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${Math.max(2, value)}%` }}
        />
      </div>
      <div className="mt-1.5 flex items-center justify-between text-xs">
        <span className="font-semibold text-ink">{labelText}</span>
        {caption && <span className="text-ink-muted">{caption}</span>}
      </div>
    </div>
  );
}
