import type { Risk } from '../types';
import { CATEGORY_META } from '../types';
import { exposure } from '../lib/score';

interface RiskMatrixProps {
  risks: Risk[];
  riskiestId?: string;
  /** Optional click handler when a plotted risk is selected. */
  onSelect?: (id: string) => void;
}

const W = 360;
const H = 360;
const PAD = 44;

function px(likelihood: number) {
  // likelihood 1..5 -> left..right
  return PAD + ((likelihood - 1) / 4) * (W - PAD * 2);
}
function py(impact: number) {
  // impact 1..5 -> bottom..top
  return H - PAD - ((impact - 1) / 4) * (H - PAD * 2);
}

/** A likelihood × impact map — the heart of prioritising what to de-risk first. */
export default function RiskMatrix({ risks, riskiestId, onSelect }: RiskMatrixProps) {
  // Spread overlapping dots a touch so nothing hides behind another.
  const seen = new Map<string, number>();

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full max-w-[420px]"
      role="img"
      aria-label="Risk matrix plotting likelihood against impact"
    >
      {/* Danger gradient: bottom-left calm, top-right hot */}
      <defs>
        <linearGradient id="matrixField" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#f1f8f4" />
          <stop offset="50%" stopColor="#fff5ed" />
          <stop offset="100%" stopColor="#ffe4d6" />
        </linearGradient>
      </defs>

      <rect
        x={PAD}
        y={PAD}
        width={W - PAD * 2}
        height={H - PAD * 2}
        rx={16}
        fill="url(#matrixField)"
        stroke="#ece8e1"
      />

      {/* Quadrant dividers */}
      <line
        x1={W / 2}
        y1={PAD}
        x2={W / 2}
        y2={H - PAD}
        stroke="#ece8e1"
        strokeDasharray="4 5"
      />
      <line
        x1={PAD}
        y1={H / 2}
        x2={W - PAD}
        y2={H / 2}
        stroke="#ece8e1"
        strokeDasharray="4 5"
      />

      {/* Quadrant labels */}
      <text x={PAD + 12} y={PAD + 22} className="fill-ink-muted" fontSize="10" opacity={0.7}>
        Monitor
      </text>
      <text
        x={W - PAD - 12}
        y={PAD + 22}
        textAnchor="end"
        fontSize="10"
        className="fill-ember-700"
        fontWeight={700}
      >
        Kill-zone — test first
      </text>
      <text
        x={PAD + 12}
        y={H - PAD - 12}
        fontSize="10"
        className="fill-ink-muted"
        opacity={0.7}
      >
        Ignore
      </text>
      <text
        x={W - PAD - 12}
        y={H - PAD - 12}
        textAnchor="end"
        fontSize="10"
        className="fill-ink-muted"
        opacity={0.7}
      >
        Watch closely
      </text>

      {/* Axis labels */}
      <text
        x={W / 2}
        y={H - 12}
        textAnchor="middle"
        fontSize="11"
        className="fill-ink"
        fontWeight={600}
      >
        Likelihood →
      </text>
      <text
        x={14}
        y={H / 2}
        textAnchor="middle"
        fontSize="11"
        className="fill-ink"
        fontWeight={600}
        transform={`rotate(-90 14 ${H / 2})`}
      >
        Impact →
      </text>

      {/* Plotted risks */}
      {risks.map((r) => {
        const key = `${r.likelihood}-${r.impact}`;
        const n = seen.get(key) ?? 0;
        seen.set(key, n + 1);
        const offset = n === 0 ? 0 : (n % 2 === 0 ? 1 : -1) * Math.ceil(n / 2) * 9;

        const cx = px(r.likelihood) + offset;
        const cy = py(r.impact) + offset;
        const radius = 7 + (exposure(r) / 25) * 9;
        const meta = CATEGORY_META[r.category];
        const isStar = r.id === riskiestId;

        return (
          <g
            key={r.id}
            className={onSelect ? 'cursor-pointer' : ''}
            onClick={() => onSelect?.(r.id)}
          >
            {isStar && (
              <circle
                cx={cx}
                cy={cy}
                r={radius + 6}
                fill="none"
                stroke="#f95816"
                strokeWidth={2}
                opacity={0.6}
              >
                <animate
                  attributeName="r"
                  values={`${radius + 4};${radius + 9};${radius + 4}`}
                  dur="2.4s"
                  repeatCount="indefinite"
                />
              </circle>
            )}
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill={meta.hex}
              fillOpacity={0.85}
              stroke="#fff"
              strokeWidth={2}
            />
          </g>
        );
      })}
    </svg>
  );
}
