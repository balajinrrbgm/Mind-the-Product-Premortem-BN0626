import { useState } from 'react';
import type { Premortem } from '../types';
import { CATEGORY_META } from '../types';
import {
  scorePremortem,
  verdict,
  riskiest,
  sortedByExposure,
  exposurePct,
  band,
  BAND_META,
} from '../lib/score';
import { toMarkdown } from '../lib/markdown';
import { buildShareUrl } from '../lib/share';
import Gauge from './Gauge';
import RiskMatrix from './RiskMatrix';
import { Link, Copy, Print, Refresh, ArrowLeft, Check, Flask, Skull } from './icons';

interface Props {
  pm: Premortem;
  onEdit: () => void;
  onReset: () => void;
  onShared: () => void;
  onCopied: () => void;
  onPrinted: () => void;
}

export default function Report({
  pm,
  onEdit,
  onReset,
  onShared,
  onCopied,
  onPrinted,
}: Props) {
  const [copied, setCopied] = useState<'md' | 'link' | null>(null);
  const score = scorePremortem(pm);
  const v = verdict(score);
  const top = riskiest(pm.risks);
  const ranked = sortedByExposure(pm.risks);

  async function copy(text: string, kind: 'md' | 'link') {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(kind);
    setTimeout(() => setCopied(null), 1800);
  }

  function shareLink() {
    const url = buildShareUrl(pm);
    window.history.replaceState(null, '', url);
    copy(url, 'link');
    onShared();
  }

  function copyMarkdown() {
    copy(toMarkdown(pm), 'md');
    onCopied();
  }

  function print() {
    onPrinted();
    window.print();
  }

  return (
    <div className="animate-fade-up">
      {/* Action bar */}
      <div className="no-print mb-6 flex flex-wrap items-center gap-2">
        <button className="btn-ghost" onClick={onEdit}>
          <ArrowLeft width={16} height={16} /> Back to edit
        </button>
        <div className="ml-auto flex flex-wrap gap-2">
          <button className="btn-outline" onClick={shareLink}>
            {copied === 'link' ? <Check width={16} height={16} /> : <Link width={16} height={16} />}
            {copied === 'link' ? 'Link copied' : 'Share link'}
          </button>
          <button className="btn-outline" onClick={copyMarkdown}>
            {copied === 'md' ? <Check width={16} height={16} /> : <Copy width={16} height={16} />}
            {copied === 'md' ? 'Copied' : 'Copy Markdown'}
          </button>
          <button className="btn-outline" onClick={print}>
            <Print width={16} height={16} /> Print / PDF
          </button>
          <button className="btn-primary" onClick={onReset}>
            <Refresh width={16} height={16} /> New pre-mortem
          </button>
        </div>
      </div>

      {/* Report header */}
      <header className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ember-600">
          Pre-mortem report
        </p>
        <h1 className="mt-2 text-4xl font-semibold text-ink sm:text-5xl">
          {pm.name || 'Untitled'}
        </h1>
        {pm.oneLiner && (
          <p className="mt-3 max-w-2xl text-lg text-ink-muted">{pm.oneLiner}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-muted">
          {pm.audience && (
            <span>
              <span className="font-semibold text-ink">For:</span> {pm.audience}
            </span>
          )}
          {pm.bet && (
            <span>
              <span className="font-semibold text-ink">The bet:</span> {pm.bet}
            </span>
          )}
        </div>
      </header>

      {/* Verdict + gauges */}
      <div className="card mb-6 grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink-muted">
            Verdict
          </p>
          <h2 className="mt-1.5 text-2xl font-semibold text-ink">{v.title}</h2>
          <p className="mt-2 text-base leading-relaxed text-ink-muted">{v.line}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-paper-line px-3 py-1 font-medium text-ink">
              {score.riskCount} risks surfaced
            </span>
            <span className="rounded-full bg-paper-line px-3 py-1 font-medium text-ink">
              {score.coveredCount} with a plan
            </span>
            <span className="rounded-full bg-paper-line px-3 py-1 font-medium text-ink">
              {score.categoriesCovered}/4 lenses covered
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-5 border-t border-paper-line pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <Gauge
            label="Exposure"
            value={score.exposureScore}
            caption="how dangerous the bet is"
          />
          <Gauge
            label="Readiness to ship"
            value={score.readiness}
            invert
            caption="how much you plan to test"
          />
        </div>
      </div>

      {/* Failure headline */}
      {pm.headline && (
        <div className="card mb-6 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-paper-line bg-ink px-6 py-3 text-paper">
            <Skull width={16} height={16} className="text-ember-400" />
            <span className="text-xs font-semibold uppercase tracking-[0.12em]">
              The failure we imagined
            </span>
          </div>
          <p className="p-6 font-serif text-xl leading-relaxed text-ink sm:text-2xl">
            &ldquo;{pm.headline}&rdquo;
          </p>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,400px)_1fr]">
        {/* Matrix + riskiest */}
        <div className="space-y-6">
          {top && (
            <div className="card border-ember-200 bg-ember-50 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ember-700">
                Riskiest assumption
              </p>
              <p className="mt-2 text-base font-semibold leading-relaxed text-ink">
                {top.title}
              </p>
              <p className="mt-2 text-xs text-ink-muted">
                {CATEGORY_META[top.category].label} · exposure {exposurePct(top)}/100 · L
                {top.likelihood} × I{top.impact}
              </p>
              {top.experiment && (
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-white/70 p-3 text-sm text-ink">
                  <Flask width={15} height={15} className="mt-0.5 shrink-0 text-ember-600" />
                  <span>{top.experiment}</span>
                </p>
              )}
            </div>
          )}

          <div className="card flex flex-col items-center p-6">
            <RiskMatrix risks={pm.risks} riskiestId={top?.id} />
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <span key={key} className="flex items-center gap-1.5 text-xs text-ink-muted">
                  <span className={`h-2.5 w-2.5 rounded-full ${meta.dot}`} />
                  {meta.label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Ranked risks */}
        <div>
          <h3 className="mb-3 text-sm font-bold text-ink">All risks, ranked by exposure</h3>
          <div className="space-y-2.5">
            {ranked.map((r, i) => {
              const meta = CATEGORY_META[r.category];
              const ex = exposurePct(r);
              const b = BAND_META[band(ex)];
              const hasPlan = !!r.experiment && r.experiment.trim().length > 0;
              return (
                <div key={r.id} className="card p-4">
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-xs font-semibold text-ink-muted">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium leading-relaxed text-ink">{r.title}</p>
                      <div className="mt-1.5 flex flex-wrap items-center gap-2">
                        <span className={`chip ${meta.tone} px-2 py-0.5 text-[10px]`}>
                          {meta.label}
                        </span>
                        <span className="text-[11px] text-ink-muted">
                          L{r.likelihood} × I{r.impact}
                        </span>
                        <span className={`text-[11px] font-bold ${b.text}`}>
                          exposure {ex}
                        </span>
                      </div>
                      {hasPlan ? (
                        <p className="mt-2 flex items-start gap-1.5 text-xs text-sage-700">
                          <Flask width={13} height={13} className="mt-0.5 shrink-0" />
                          <span>{r.experiment}</span>
                        </p>
                      ) : (
                        <p className="mt-2 text-xs italic text-ember-600">
                          No de-risk plan yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="no-print mt-10 text-center text-sm text-ink-muted">
        Built with{' '}
        <span className="font-semibold text-ink">Premortem</span> — usage measured with Novus.
      </p>
    </div>
  );
}
