import { Arrow, Skull, Target, Flask, Spark } from './icons';

interface HeroProps {
  onStart: () => void;
  onExample: () => void;
}

const STEPS = [
  { icon: Skull, title: 'Imagine it failed', body: 'Step into the future where your launch flopped, so you stop defending the idea.' },
  { icon: Spark, title: 'Surface the risks', body: 'Name every way it could die across desirability, usability, feasibility, viability.' },
  { icon: Target, title: 'Map what matters', body: 'Plot likelihood against impact to find the one assumption that decides everything.' },
  { icon: Flask, title: 'Plan to de-risk', body: 'Attach the cheapest experiment that could prove you wrong — before you build.' },
];

export default function Hero({ onStart, onExample }: HeroProps) {
  return (
    <div className="animate-fade-up">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 pb-10 pt-20 text-center sm:pt-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-paper-line bg-paper-card px-4 py-1.5 text-xs font-semibold text-ink-muted shadow-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-ember-500" />
            A pre-mortem for people who ship
          </span>

          <h1 className="mt-7 text-balance text-5xl font-semibold leading-[1.05] text-ink sm:text-6xl">
            Kill your idea before
            <br />
            it kills your{' '}
            <span className="relative whitespace-nowrap text-ember-600">
              roadmap
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C40 3 160 3 198 7"
                  stroke="#f95816"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            .
          </h1>

          <p className="mx-auto mt-8 max-w-xl text-balance text-lg leading-relaxed text-ink-muted">
            A pre-mortem is the fastest way to find the assumption that will sink your product —
            while it&rsquo;s still cheap to fix. Run one in about ten minutes. No sign-up, no fluff.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button className="btn-ember w-full px-7 py-3 text-base sm:w-auto" onClick={onStart}>
              Run a pre-mortem <Arrow width={18} height={18} />
            </button>
            <button className="btn-outline w-full px-7 py-3 text-base sm:w-auto" onClick={onExample}>
              See a worked example
            </button>
          </div>

          <p className="mt-5 text-sm text-ink-muted/80">
            Everything stays in your browser. Share results with a link — no account required.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <div key={s.title} className="card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-paper">
                  <s.icon width={18} height={18} />
                </span>
                <span className="font-mono text-xs font-semibold text-ink-muted">
                  0{i + 1}
                </span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="card relative overflow-hidden p-8 sm:p-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-ember-50" />
          <blockquote className="relative">
            <p className="font-serif text-2xl leading-snug text-ink sm:text-3xl">
              &ldquo;Prospective hindsight &mdash; imagining that an event has already occurred
              &mdash; increases the ability to correctly identify reasons for future outcomes by
              30%.&rdquo;
            </p>
            <footer className="mt-5 text-sm font-semibold text-ink-muted">
              Gary Klein, the research behind the pre-mortem technique
            </footer>
          </blockquote>
          <p className="relative mt-6 text-base leading-relaxed text-ink-muted">
            Teams are great at defending ideas and terrible at attacking them. A pre-mortem flips
            the room: instead of asking &ldquo;will this work?&rdquo;, it assumes failure and asks
            &ldquo;<span className="font-semibold text-ink">why did it?</span>&rdquo; Premortem turns
            that exercise into something you can run solo, score, and share in minutes.
          </p>
        </div>
      </section>
    </div>
  );
}
