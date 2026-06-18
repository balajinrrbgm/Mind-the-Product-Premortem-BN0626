interface StepHeaderProps {
  index: number;
  total: number;
  eyebrow: string;
  title: string;
  subtitle: string;
}

export default function StepHeader({ index, total, eyebrow, title, subtitle }: StepHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs font-semibold text-ember-600">
          {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
          {eyebrow}
        </span>
      </div>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-ink-muted">{subtitle}</p>
    </header>
  );
}
