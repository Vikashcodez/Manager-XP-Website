import React from 'react';

/*
 * Portal primitives.
 *
 * The customer portal is a product a café owner pays for, not an internal
 * tool, so these lean warmer and calmer than the ManagerXP admin kit: more
 * space, softer surfaces, and status carried by shape as well as colour.
 * Shared here so a change to how a panel looks happens once.
 */

export const Page = ({ title, lede, actions, children }) => (
  <div className="space-y-7">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
        {lede && <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-neutral-400">{lede}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </header>
    {children}
  </div>
);

export const Card = ({ title, description, actions, className = '', children }) => (
  <section className={`rounded-2xl border border-neutral-800 bg-neutral-900/50 ${className}`}>
    {(title || actions) && (
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-800 px-5 py-4">
        <div>
          {title && <h2 className="text-sm font-semibold text-white">{title}</h2>}
          {description && <p className="mt-1 text-xs leading-relaxed text-neutral-400">{description}</p>}
        </div>
        {actions}
      </div>
    )}
    <div className="p-5">{children}</div>
  </section>
);

export const Button = ({ variant = 'primary', size = 'md', className = '', children, ...props }) => {
  const variants = {
    primary: 'bg-red-500 text-white hover:bg-red-400 disabled:opacity-50',
    ghost: 'border border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white disabled:opacity-50',
    danger: 'border border-red-500/40 text-red-300 hover:bg-red-500/10 disabled:opacity-50',
    quiet: 'text-neutral-400 hover:text-white disabled:opacity-50'
  };
  const sizes = { sm: 'px-2.5 py-1 text-xs', md: 'px-4 py-2 text-sm' };
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export const Field = ({ label, hint, id, required, children }) => (
  <div>
    <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-neutral-300">
      {label}{required && <span className="ml-0.5 text-red-400">*</span>}
    </label>
    {children}
    {hint && <p className="mt-1 text-xs text-neutral-500">{hint}</p>}
  </div>
);

export const inputClass =
  'w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-white ' +
  'placeholder-neutral-600 outline-none transition focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20';

export const Input = (props) => <input className={inputClass} {...props} />;
export const Select = ({ children, ...props }) => (
  <select className={inputClass} {...props}>{children}</select>
);

export const Pill = ({ tone = 'mute', children }) => {
  const tones = {
    good: 'bg-emerald-500/10 text-emerald-300 ring-emerald-500/25',
    warn: 'bg-amber-500/10 text-amber-300 ring-amber-500/25',
    bad: 'bg-red-500/10 text-red-300 ring-red-500/25',
    info: 'bg-sky-500/10 text-sky-300 ring-sky-500/25',
    mute: 'bg-neutral-800/70 text-neutral-400 ring-neutral-700'
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
};

/* A live/offline dot. Shape and colour together, so the state survives being
   read by someone who cannot distinguish red from green. */
export const StatusDot = ({ online, label }) => (
  <span className="inline-flex items-center gap-1.5 text-xs">
    <span className={`h-1.5 w-1.5 rounded-full ${online ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
    <span className={online ? 'text-emerald-300' : 'text-neutral-500'}>
      {label || (online ? 'Online' : 'Offline')}
    </span>
  </span>
);

export const Stat = ({ label, value, sub, tone = 'default' }) => {
  const rings = {
    default: 'border-neutral-800',
    good: 'border-emerald-500/25',
    warn: 'border-amber-500/30',
    bad: 'border-red-500/30'
  };
  return (
    <div className={`rounded-xl border ${rings[tone]} bg-neutral-900/50 p-4`}>
      <div className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="mt-1.5 text-2xl font-bold tracking-tight text-white">{value}</div>
      {sub && <div className="mt-0.5 text-xs text-neutral-500">{sub}</div>}
    </div>
  );
};

export const Banner = ({ tone = 'info', title, children, action }) => {
  const tones = {
    good: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-100',
    warn: 'border-amber-500/30 bg-amber-500/5 text-amber-100',
    bad: 'border-red-500/30 bg-red-500/5 text-red-100',
    info: 'border-neutral-800 bg-neutral-900/60 text-neutral-300'
  };
  return (
    <div className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 ${tones[tone]}`}>
      <div className="text-sm">
        {title && <strong className="mr-1.5">{title}</strong>}
        {children}
      </div>
      {action}
    </div>
  );
};

export const Empty = ({ title, text, action }) => (
  <div className="rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/30 p-12 text-center">
    <p className="text-sm font-medium text-neutral-300">{title}</p>
    {text && <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-neutral-500">{text}</p>}
    {action && <div className="mt-5 flex justify-center">{action}</div>}
  </div>
);

export const Skeleton = ({ rows = 3, height = 'h-24' }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className={`${height} animate-pulse rounded-xl border border-neutral-800 bg-neutral-900/40`} />
    ))}
  </div>
);

export const Table = ({ columns, children }) => (
  <div className="overflow-x-auto rounded-xl border border-neutral-800">
    <table className="w-full text-sm">
      <thead className="bg-neutral-900/80 text-left text-[11px] uppercase tracking-wider text-neutral-500">
        <tr>{columns.map((c) => (
          <th key={c} className="whitespace-nowrap px-4 py-3 font-semibold">{c}</th>
        ))}</tr>
      </thead>
      <tbody className="divide-y divide-neutral-800/70">{children}</tbody>
    </table>
  </div>
);

/*
 * A usage meter — "18 / 50 PCs".
 *
 * The bar turns amber approaching the limit and red at it, because the number
 * alone does not tell an owner they are about to be blocked from adding a PC.
 */
export const Meter = ({ used, max, label }) => {
  if (max == null) {
    return <div className="text-sm text-neutral-400">{used} {label}</div>;
  }
  const pct = max > 0 ? Math.min(100, (used / max) * 100) : 0;
  const tone = pct >= 100 ? 'bg-red-500' : pct >= 80 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-neutral-300">{label}</span>
        <span className="font-semibold text-white">
          {used} <span className="text-neutral-500">/ {max}</span>
        </span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-neutral-800">
        <div className={`h-full rounded-full ${tone} transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

/** A value the user must copy once and cannot retrieve — an invite link. */
export const CopyBox = ({ label, value, note }) => {
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
    <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300">{label}</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <code className="select-all break-all rounded-lg bg-neutral-950 px-3 py-2 font-mono text-xs text-white">
          {value}
        </code>
        <Button variant="ghost" size="sm" type="button" onClick={copy}>
          {copied ? 'Copied' : 'Copy'}
        </Button>
      </div>
      {note && <p className="mt-2 text-xs text-amber-200/70">{note}</p>}
    </div>
  );
};
