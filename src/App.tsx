import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Premortem, Risk } from './types';
import { loadLocal, saveLocal, clearLocal, decodeFromHash } from './lib/share';
import { examplePremortem } from './data/example';
import { initAnalytics, track, Events } from './analytics';
import Hero from './components/Hero';
import Stepper from './components/Stepper';
import type { StepDef } from './components/Stepper';
import FrameStep from './components/steps/FrameStep';
import FailureStep from './components/steps/FailureStep';
import RisksStep from './components/steps/RisksStep';
import MapStep from './components/steps/MapStep';
import DeriskStep from './components/steps/DeriskStep';
import Report from './components/Report';
import { Arrow, ArrowLeft } from './components/icons';

type View = 'landing' | 'flow' | 'report';

const STEPS: StepDef[] = [
  { key: 'frame', label: 'Frame' },
  { key: 'imagine', label: 'Imagine' },
  { key: 'surface', label: 'Surface' },
  { key: 'map', label: 'Prioritise' },
  { key: 'derisk', label: 'De-risk' },
];

function blankPremortem(): Premortem {
  return {
    v: 1,
    name: '',
    oneLiner: '',
    audience: '',
    bet: '',
    headline: '',
    risks: [],
    createdAt: new Date().toISOString(),
  };
}

export default function App() {
  const [pm, setPm] = useState<Premortem>(blankPremortem);
  const [view, setView] = useState<View>('landing');
  const [step, setStep] = useState(0);
  const [maxReached, setMaxReached] = useState(0);
  const loaded = useRef(false);

  // Boot: hydrate from a share link or local autosave, then start analytics.
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    initAnalytics();

    const shared = decodeFromHash(window.location.hash);
    if (shared) {
      setPm(shared);
      setView('report');
      setMaxReached(STEPS.length - 1);
      track(Events.reportReached, { source: 'share_link' });
      return;
    }
    const local = loadLocal();
    if (local && (local.name || local.risks.length)) {
      setPm(local);
    }
  }, []);

  // Autosave whenever the working pre-mortem changes.
  useEffect(() => {
    if (view !== 'landing') saveLocal(pm);
  }, [pm, view]);

  const patch = useCallback((p: Partial<Premortem>) => {
    setPm((prev) => ({ ...prev, ...p }));
  }, []);

  const setRisks = useCallback((risks: Risk[]) => {
    setPm((prev) => ({ ...prev, risks }));
  }, []);

  const goToStep = useCallback(
    (i: number) => {
      setStep(i);
      setMaxReached((m) => Math.max(m, i));
      track(Events.stepViewed, { step: STEPS[i]?.key });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  function startBlank() {
    const fresh = blankPremortem();
    setPm(fresh);
    clearLocal();
    setView('flow');
    setStep(0);
    setMaxReached(0);
    track(Events.startPremortem, { source: 'cta' });
    window.scrollTo({ top: 0 });
  }

  function startExample() {
    setPm(examplePremortem());
    setView('report');
    setMaxReached(STEPS.length - 1);
    track(Events.loadedExample);
    window.scrollTo({ top: 0 });
  }

  function reset() {
    const fresh = blankPremortem();
    setPm(fresh);
    clearLocal();
    window.history.replaceState(null, '', window.location.pathname);
    setView('flow');
    setStep(0);
    setMaxReached(0);
    track(Events.reset);
    window.scrollTo({ top: 0 });
  }

  function next() {
    if (step < STEPS.length - 1) {
      goToStep(step + 1);
    } else {
      setView('report');
      setMaxReached(STEPS.length - 1);
      track(Events.reportReached, { source: 'flow' });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function back() {
    if (step > 0) goToStep(step - 1);
    else setView('landing');
  }

  const canContinue = useMemo(() => {
    if (step === 0) return pm.name.trim().length > 0;
    if (step === 2) return pm.risks.length > 0;
    return true;
  }, [step, pm.name, pm.risks.length]);

  const continueLabel = step === STEPS.length - 1 ? 'See report' : 'Continue';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="no-print sticky top-0 z-20 border-b border-paper-line/70 bg-paper/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <button
            className="flex items-center gap-2.5"
            onClick={() => setView('landing')}
            aria-label="Premortem home"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-ink">
              <svg viewBox="0 0 64 64" width="20" height="20" aria-hidden>
                <path
                  d="M20 44 L32 18 L44 44"
                  fill="none"
                  stroke="#f95816"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="32" cy="40" r="4" fill="#5fa37f" />
              </svg>
            </span>
            <span className="text-lg font-semibold tracking-tight text-ink">Premortem</span>
          </button>

          {view === 'landing' ? (
            <button className="btn-ember" onClick={startBlank}>
              Start <Arrow width={16} height={16} />
            </button>
          ) : (
            <button className="btn-ghost text-sm" onClick={() => setView('landing')}>
              Exit
            </button>
          )}
        </div>
      </header>

      <main>
        {view === 'landing' && <Hero onStart={startBlank} onExample={startExample} />}

        {view === 'flow' && (
          <div className="mx-auto max-w-3xl px-6 py-8 sm:py-10">
            <div className="mb-9">
              <Stepper steps={STEPS} current={step} maxReached={maxReached} onGo={goToStep} />
            </div>

            {step === 0 && (
              <FrameStep pm={pm} patch={patch} stepIndex={1} totalSteps={STEPS.length} />
            )}
            {step === 1 && (
              <FailureStep pm={pm} patch={patch} stepIndex={2} totalSteps={STEPS.length} />
            )}
            {step === 2 && (
              <RisksStep
                pm={pm}
                setRisks={setRisks}
                onSuggestionUsed={() => track(Events.suggestionUsed)}
                stepIndex={3}
                totalSteps={STEPS.length}
              />
            )}
            {step === 3 && (
              <MapStep
                pm={pm}
                setRisks={setRisks}
                onStar={() => track(Events.riskiestStarred)}
                stepIndex={4}
                totalSteps={STEPS.length}
              />
            )}
            {step === 4 && (
              <DeriskStep
                pm={pm}
                setRisks={setRisks}
                onExperimentPicked={() => track(Events.experimentPicked)}
                stepIndex={5}
                totalSteps={STEPS.length}
              />
            )}

            {/* Flow nav */}
            <div className="mt-10 flex items-center justify-between">
              <button className="btn-ghost" onClick={back}>
                <ArrowLeft width={16} height={16} />
                {step === 0 ? 'Home' : 'Back'}
              </button>
              <div className="flex items-center gap-3">
                {step === 2 && pm.risks.length === 0 && (
                  <span className="text-xs text-ink-muted">Add at least one risk</span>
                )}
                {step === 0 && !canContinue && (
                  <span className="text-xs text-ink-muted">Name it to continue</span>
                )}
                <button className="btn-ember" onClick={next} disabled={!canContinue}>
                  {continueLabel} <Arrow width={16} height={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {view === 'report' && (
          <div className="mx-auto max-w-5xl px-6 py-8 sm:py-10">
            <Report
              pm={pm}
              onEdit={() => {
                setView('flow');
                setStep(STEPS.length - 1);
                setMaxReached(STEPS.length - 1);
                window.scrollTo({ top: 0 });
              }}
              onReset={reset}
              onShared={() => track(Events.shareCreated)}
              onCopied={() => track(Events.markdownCopied)}
              onPrinted={() => track(Events.reportPrinted)}
            />
          </div>
        )}
      </main>

      <footer className="no-print border-t border-paper-line/70 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 text-sm text-ink-muted sm:flex-row">
          <p>
            <span className="font-semibold text-ink">Premortem</span> · Kill your idea before it
            kills your roadmap.
          </p>
          <p className="text-xs">
            Built for World Product Day · #EveryoneShipsNow · analytics by Novus
          </p>
        </div>
      </footer>
    </div>
  );
}
