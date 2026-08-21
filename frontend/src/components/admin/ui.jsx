import React from 'react';

/*
 * Shared admin primitives.
 *
 * The console had grown seven pages each inventing its own card border, its
 * own input styling and its own idea of what a heading weighs — which is most
 * of why it read as unfinished. These are the pieces they all now use, so a
 * change to how a panel looks happens once.
 */

export const Page = ({ title, lede, actions, children }) => (
  <div className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-white">{title}</h2>
        {lede && <p className="mt-1 max-w-2xl text-sm text-neutral-400">{lede}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
    {children}
  </div>
);

export const Panel = ({ title, description, children, className = '' }) => (
  <section className={`rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 sm:p-5 ${className}`}>
    {(title || description) && (
      <div className="mb-4">
        {title && <h3 className="text-sm font-semibold text-white">{title}</h3>}
        {description && <p className="mt-1 text-xs leading-relaxed text-neutral-400">{description}</p>}
      </div>
    )}
    {children}
  </section>
);

export const Button = ({ variant = 'primary', className = '', children, ...props }) => {
  const variants = {
    primary: 'bg-red-500 text-white hover:bg-red-400 disabled:opacity-50',
    ghost: 'border border-neutral-700 text-neutral-300 hover:border-red-500/50 hover:text-white disabled:opacity-50',
    danger: 'border border-neutral-700 text-neutral-400 hover:border-red-500/50 hover:text-red-300 disabled:opacity-50',
    good: 'border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 disabled:opacity-50'
  };
  return (
    <button
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

/*
 * Every field is labelled and every label is bound to its control. Several of
 * the older forms used placeholder text as the only label, which disappears
 * the moment anyone types and is invisible to a screen reader.
 */
export const Field = ({ label, hint, id, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
      {label}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
  </div>
);

export const inputClass =
  'w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-white placeholder-neutral-600 outline-none transition focus:border-red-500/50';

export const Input = (props) => <input className={inputClass} {...props} />;
export const Select = ({ children, ...props }) => (
  <select className={inputClass} {...props}>{children}</select>
);

export const Pill = ({ tone = 'mute', children }) => {
  const tones = {
    good: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    warn: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    bad: 'bg-red-500/15 text-red-300 border-red-500/30',
    info: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    mute: 'bg-neutral-800 text-neutral-400 border-neutral-700'
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
};

export const Banner = ({ tone = 'info', children }) => {
  const tones = {
    good: 'border-emerald-500/35 bg-emerald-500/10 text-emerald-200',
    warn: 'border-amber-500/35 bg-amber-500/10 text-amber-200',
    bad: 'border-red-500/35 bg-red-500/10 text-red-200',
    info: 'border-neutral-800 bg-neutral-900 text-neutral-300'
  };
  return <div className={`rounded-xl border p-3 text-sm ${tones[tone]}`}>{children}</div>;
};

export const Empty = ({ title, text, action }) => (
  <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-10 text-center">
    <p className="text-sm font-medium text-neutral-300">{title}</p>
    {text && <p className="mx-auto mt-1.5 max-w-sm text-sm text-neutral-500">{text}</p>}
    {action && <div className="mt-4 flex justify-center">{action}</div>}
  </div>
);

export const Skeleton = ({ rows = 3, height = 'h-20' }) => (
  <div className="space-y-2">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className={`${height} animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/40`} />
    ))}
  </div>
);

export const Table = ({ columns, children }) => (
  <div className="overflow-x-auto rounded-xl border border-neutral-800">
    <table className="w-full text-sm">
      <thead className="bg-neutral-900/80 text-left text-[11px] uppercase tracking-wider text-neutral-500">
        <tr>
          {columns.map((c) => (
            <th key={c} className="whitespace-nowrap px-4 py-2.5 font-semibold">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-800">{children}</tbody>
    </table>
  </div>
);

/*
 * A value the admin must copy once and cannot get back — a licence key, a
 * temporary password. Shown in a way that makes copying the obvious action,
 * and says plainly that it will not be shown again, because the commonest
 * failure is closing the dialog and losing it.
 */
export const CopyableSecret = ({ label, value, note }) => {
  const [copied, setCopied] = React.useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(`Copy this ${label.toLowerCase()}:`, value);
    }
  };

  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">{label}</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <code className="select-all break-all rounded-lg bg-neutral-950 px-3 py-2 font-mono text-sm text-white">
          {value}
        </code>
        <Button variant="ghost" type="button" onClick={copy}>{copied ? 'Copied' : 'Copy'}</Button>
      </div>
      {note && <p className="mt-2 text-xs text-amber-200/80">{note}</p>}
    </div>
  );
};
