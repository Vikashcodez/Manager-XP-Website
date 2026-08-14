import React, { useEffect, useMemo, useRef, useState } from 'react';
import { animate, createDraggable, createScope, createTimeline, onScroll, stagger, svg } from 'animejs';
import { Flag, Gauge, Timer, Trophy, Layers, Radio, CircuitBoard, Plus } from 'lucide-react';
import Reveal from './Reveal';
import DemoBadge from './DemoBadge';
import { prefersReducedMotion } from '../lib/motion';

/**
 * RaceXP — presented strictly as a Phase 2 concept.
 *
 * Nothing here is claimed as available today: the capability lists are labelled
 * as planned, and every figure in the telemetry, leaderboard and lap tables is
 * generated sample data for illustration.
 */

const TRACK_PATH =
  'M60,190 C20,190 20,120 60,110 C110,98 120,150 165,140 C205,131 195,60 245,55 C300,50 340,70 350,105 C362,146 330,190 280,190 Z';

const SECTORS = [
  { label: 'Start', at: 0 },
  { label: 'S1', at: 0.28 },
  { label: 'S2', at: 0.56 },
  { label: 'S3', at: 0.82 },
  { label: 'Finish', at: 1 }
];

// Deterministic sample traces so the visual is stable between renders.
const seeded = (i, offset, amp, base) =>
  base + Math.sin(i / 7 + offset) * amp + Math.sin(i / 2.3 + offset * 2) * (amp / 3);

const SAMPLES = 120;

// Virtual duration for the seekable motion-path animation (never played live).
const MOTION_PATH_DURATION = 1000;

const buildTrace = (offset, fast) =>
  Array.from({ length: SAMPLES }, (_, i) => {
    const t = i / (SAMPLES - 1);
    // Speed dips into corners, recovers on straights.
    const corner = Math.abs(Math.sin(t * Math.PI * 3 + offset));
    const speed = Math.max(58, Math.min(298, 300 - corner * 150 + seeded(i, offset, 12, 0) + (fast ? 8 : 0)));
    const throttle = Math.max(0, Math.min(100, (speed - 58) / 2.4 + seeded(i, offset, 8, 0)));
    const brake = Math.max(0, Math.min(100, corner * 90 - throttle * 0.35));
    return { speed, throttle, brake };
  });

const currentLap = buildTrace(0.6, false);
const bestLap = buildTrace(0.35, true);

const toPoints = (trace, key, max, w, h) =>
  trace
    .map((d, i) => `${((i / (SAMPLES - 1)) * w).toFixed(1)},${(h - (d[key] / max) * h).toFixed(1)}`)
    .join(' ');

const leaderboardSeed = [
  { id: 'D1', driver: 'Driver A', best: '1:41.882', gap: '—' },
  { id: 'D2', driver: 'Driver B', best: '1:42.140', gap: '+0.258' },
  { id: 'D3', driver: 'Driver C', best: '1:42.907', gap: '+1.025' },
  { id: 'D4', driver: 'Driver D', best: '1:43.554', gap: '+1.672' },
  { id: 'D5', driver: 'Driver E', best: '1:44.011', gap: '+2.129' }
];

const plannedAddOn = [
  'Simulator management',
  'Race session control',
  'Driver profiles',
  'Lap timing',
  'Leaderboards'
];

const plannedStandalone = [
  'Venue management',
  'Race scheduling',
  'Championships & events',
  'Race results',
  'Telemetry capture',
  'Remote operations'
];

const formatLapTime = (progress) => {
  const total = 102.4 * progress; // sample lap length in seconds
  const m = Math.floor(total / 60);
  const s = (total % 60).toFixed(2).padStart(5, '0');
  return `${m}:${s}`;
};

const RaceXPPreview = () => {
  const rootRef = useRef(null);
  const trackRef = useRef(null);
  const markerRef = useRef(null);
  const handleRef = useRef(null);
  const railRef = useRef(null);
  const markerPathRef = useRef(null);

  const [progress, setProgress] = useState(0.42);
  const [board, setBoard] = useState(leaderboardSeed);
  const draggableRef = useRef(null);
  const progressRef = useRef(0.42);

  // Mirror the scrub position into a ref so event handlers read a current value
  // without re-subscribing.
  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  /**
   * Move the scrub position from somewhere other than a drag (keyboard).
   * The handle's transform is owned by the draggable, so it has to be told —
   * muted, so this does not bounce back through onUpdate.
   */
  const scrubTo = (next) => {
    const clamped = Math.min(1, Math.max(0, next));
    setProgress(clamped);

    const rail = railRef.current;
    const draggable = draggableRef.current;
    if (draggable && rail) {
      draggable.setX(clamped * rail.getBoundingClientRect().width, true);
    }
  };

  const sampleIndex = Math.min(SAMPLES - 1, Math.round(progress * (SAMPLES - 1)));
  const now = currentLap[sampleIndex];
  const ref = bestLap[sampleIndex];
  const delta = ((now.speed - ref.speed) / 100).toFixed(3);

  const chart = useMemo(
    () => ({
      w: 640,
      h: 120,
      speedNow: toPoints(currentLap, 'speed', 300, 640, 120),
      speedBest: toPoints(bestLap, 'speed', 300, 640, 120),
      throttle: toPoints(currentLap, 'throttle', 100, 640, 52),
      brake: toPoints(currentLap, 'brake', 100, 640, 52)
    }),
    []
  );

  /**
   * Coordinated race sequence, played when the section scrolls into view:
   * track draws -> driver marker appears -> telemetry traces draw -> sector
   * markers activate. One timeline rather than several independent animations.
   */
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const scope = createScope({ root: rootRef }).add(() => {
      const tl = createTimeline({
        defaults: { ease: 'inOutQuad' },
        autoplay: onScroll({ target: rootRef.current, enter: 'bottom-=100 top', repeat: false })
      });

      tl.add(svg.createDrawable('.rx-track'), { draw: ['0 0', '0 1'], duration: 1500 }, 0)
        .add('.rx-marker', { opacity: [0, 1], scale: [0.4, 1], duration: 520, ease: 'out(3)' }, 900)
        .add(svg.createDrawable('.rx-trace'), { draw: ['0 0', '0 1'], duration: 1300, delay: stagger(140) }, 1000)
        .add('.rx-sector', { opacity: [0, 1], duration: 420, delay: stagger(90) }, 1600);
    });

    return () => scope.revert();
  }, []);

  /**
   * The driver marker follows the circuit with Anime's motion path, so it picks
   * up orientation along the curve rather than just x/y. The animation is never
   * played — it is seeked to the scrub position, which keeps the marker exactly
   * in sync with the telemetry readout.
   */
  useEffect(() => {
    const path = trackRef.current;
    const marker = markerRef.current;
    if (!path || !marker) return;

    const motionPath = svg.createMotionPath(path);
    const seekable = animate(marker, {
      translateX: motionPath.translateX,
      translateY: motionPath.translateY,
      rotate: motionPath.rotate,
      duration: MOTION_PATH_DURATION,
      ease: 'linear',
      autoplay: false
    });

    markerPathRef.current = seekable;
    seekable.seek(progressRef.current * MOTION_PATH_DURATION);

    return () => {
      seekable.revert();
      markerPathRef.current = null;
    };
  }, []);

  // Keep the marker glued to the scrub position.
  useEffect(() => {
    markerPathRef.current?.seek(progress * MOTION_PATH_DURATION);
  }, [progress]);

  // Draggable scrub handle with snap points and spring release.
  useEffect(() => {
    const handle = handleRef.current;
    const rail = railRef.current;
    if (!handle || !rail || prefersReducedMotion()) return;

    const width = () => rail.getBoundingClientRect().width;

    const draggable = createDraggable(handle, {
      container: rail,
      y: false,
      x: { snap: SECTORS.map((s) => s.at * width()) },
      releaseStiffness: 120,
      releaseDamping: 18,
      onUpdate: (self) => {
        const w = width();
        if (!w) return;
        setProgress(Math.min(1, Math.max(0, self.x / w)));
      }
    });

    draggableRef.current = draggable;
    // Seat the handle at the current scrub position on mount.
    draggable.setX(progressRef.current * width(), true);

    return () => {
      draggable.revert();
      draggableRef.current = null;
    };
  }, []);

  // Occasional position swap in the leaderboard, with a highlight on the mover.
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const id = setInterval(() => {
      setBoard((prev) => {
        const next = [...prev];
        const i = 1 + Math.floor(Math.random() * (next.length - 1));
        [next[i - 1], next[i]] = [next[i], next[i - 1]];
        return next;
      });
    }, 4500);

    return () => clearInterval(id);
  }, []);

  const onHandleKey = (event) => {
    const step = event.shiftKey ? 0.1 : 0.02;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      scrubTo(progressRef.current + step);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      scrubTo(progressRef.current - step);
    } else if (event.key === 'Home') {
      event.preventDefault();
      scrubTo(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      scrubTo(1);
    }
  };

  const channels = [
    { label: 'Speed', value: `${Math.round(now.speed)} km/h`, icon: <Gauge className="w-3.5 h-3.5" /> },
    { label: 'Throttle', value: `${Math.round(now.throttle)}%`, icon: <CircuitBoard className="w-3.5 h-3.5" /> },
    { label: 'Brake', value: `${Math.round(now.brake)}%`, icon: <Radio className="w-3.5 h-3.5" /> },
    { label: 'Delta', value: `${delta > 0 ? '-' : '+'}${Math.abs(delta)}s`, icon: <Timer className="w-3.5 h-3.5" /> }
  ];

  return (
    <div ref={rootRef} className="space-y-10">

      {/* Phase 2 header */}
      <Reveal>
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-6 sm:p-8 backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-red-400">
              <Flag className="w-3 h-3" aria-hidden="true" />
              Phase 2 · In development
            </span>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
              Not yet available
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white text-balance">
            RaceXP — the next generation of{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
              racing centre management.
            </span>
          </h3>
          <p className="mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-neutral-400 text-pretty">
            RaceXP extends the ManagerXP platform into sim racing centres, racing lounges and simulator
            venues. Everything below describes the planned direction for this product, not features you
            can buy today.
          </p>
        </div>
      </Reveal>

      {/* Two future forms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Reveal className="h-full">
          <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-red-500/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-lg border border-white/10 bg-white/5 p-2 text-red-500">
                <Plus className="w-4 h-4" aria-hidden="true" />
              </span>
              <h4 className="text-lg font-semibold text-white">CafeXP + RaceXP add-on</h4>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400 mb-4">
              For a gaming cafe that wants to add racing simulators alongside its existing floor —
              one operation, gaming and racing together.
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">Planned areas</p>
            <ul className="space-y-2">
              {plannedAddOn.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-neutral-300">
                  <span className="h-1 w-1 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={110} className="h-full">
          <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-red-500/30">
            <div className="flex items-center gap-2 mb-3">
              <span className="rounded-lg border border-white/10 bg-white/5 p-2 text-red-500">
                <Layers className="w-4 h-4" aria-hidden="true" />
              </span>
              <h4 className="text-lg font-semibold text-white">RaceXP standalone</h4>
            </div>
            <p className="text-sm leading-relaxed text-neutral-400 mb-4">
              For dedicated sim-racing centres and simulator venues that do not run a gaming cafe at all,
              eventually running as its own product.
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-600 mb-2">Planned areas</p>
            <ul className="space-y-2">
              {plannedStandalone.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-neutral-300">
                  <span className="h-1 w-1 rounded-full bg-red-500 shrink-0" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Telemetry concept */}
      <Reveal>
        <div className="rounded-2xl border border-white/10 bg-neutral-950/70 backdrop-blur-xl overflow-hidden shadow-[0_0_60px_-30px_rgba(220,38,38,0.6)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-white/[0.02] px-4 sm:px-5 py-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-white">
              <Gauge className="w-4 h-4 text-red-500" aria-hidden="true" />
              Lap telemetry · concept
            </span>
            <DemoBadge />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">

            {/* Track */}
            <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-white/5 p-5">
              <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 mb-3">Circuit</p>
              <svg viewBox="0 0 400 240" className="w-full h-auto" role="img" aria-label="Sample circuit layout with car position">
                <path d={TRACK_PATH} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="18" strokeLinejoin="round" />
                <path
                  ref={trackRef}
                  className="rx-track"
                  d={TRACK_PATH}
                  fill="none"
                  stroke="rgba(239,68,68,0.85)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                <g ref={markerRef} className="rx-marker">
                  <circle r="6" fill="#ef4444" />
                  <circle r="11" fill="none" stroke="rgba(239,68,68,0.45)" strokeWidth="2" />
                </g>
              </svg>

              <dl className="mt-4 grid grid-cols-2 gap-2.5">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                  <dt className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">Lap time</dt>
                  <dd className="text-sm font-semibold tabular-nums text-white">{formatLapTime(progress)}</dd>
                </div>
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                  <dt className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">Best lap</dt>
                  <dd className="text-sm font-semibold tabular-nums text-red-400">1:41.882</dd>
                </div>
              </dl>
            </div>

            {/* Traces + scrubber */}
            <div className="lg:col-span-3 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                  Speed · current vs best
                </span>
                <span className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-wider">
                  <span className="flex items-center gap-1 text-red-400">
                    <span className="h-[2px] w-3 bg-red-500" aria-hidden="true" /> Current
                  </span>
                  <span className="flex items-center gap-1 text-neutral-500">
                    <span className="h-[2px] w-3 bg-neutral-500" aria-hidden="true" /> Best
                  </span>
                </span>
              </div>

              <svg viewBox="0 0 640 120" className="w-full h-24" role="img" aria-label="Sample speed trace comparing current lap with best lap">
                {SECTORS.slice(1, -1).map((s) => (
                  <line
                    key={s.label}
                    className="rx-sector"
                    x1={s.at * 640}
                    y1="0"
                    x2={s.at * 640}
                    y2="120"
                    stroke="rgba(255,255,255,0.09)"
                    strokeDasharray="3 4"
                  />
                ))}
                <polyline className="rx-trace" points={chart.speedBest} fill="none" stroke="rgba(163,163,163,0.65)" strokeWidth="1.5" />
                <polyline className="rx-trace" points={chart.speedNow} fill="none" stroke="#ef4444" strokeWidth="2" />
                <line
                  x1={progress * 640}
                  y1="0"
                  x2={progress * 640}
                  y2="120"
                  stroke="rgba(239,68,68,0.9)"
                  strokeWidth="1"
                />
              </svg>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">Throttle</span>
                  <svg viewBox="0 0 640 52" className="w-full h-10" aria-hidden="true">
                    <polyline className="rx-trace" points={chart.throttle} fill="none" stroke="rgba(52,211,153,0.7)" strokeWidth="1.5" />
                  </svg>
                </div>
                <div>
                  <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-500">Brake</span>
                  <svg viewBox="0 0 640 52" className="w-full h-10" aria-hidden="true">
                    <polyline className="rx-trace" points={chart.brake} fill="none" stroke="rgba(248,113,113,0.8)" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Scrubber */}
              <div className="mt-5">
                <div ref={railRef} className="relative h-9 rounded-full border border-white/10 bg-white/[0.03]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-red-900/50 to-red-600/40"
                    style={{ width: `${progress * 100}%` }}
                    aria-hidden="true"
                  />
                  {SECTORS.map((s) => (
                    <span
                      key={s.label}
                      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-[8px] font-mono uppercase tracking-wider text-neutral-500"
                      style={{ left: `${s.at * 100}%` }}
                      aria-hidden="true"
                    >
                      <span className="block h-2 w-px bg-white/20 mx-auto mb-0.5" />
                      {s.label}
                    </span>
                  ))}
                  <div
                    ref={handleRef}
                    role="slider"
                    tabIndex={0}
                    aria-label="Scrub lap position"
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={Math.round(progress * 100)}
                    aria-valuetext={`${formatLapTime(progress)} of lap`}
                    onKeyDown={onHandleKey}
                    className="absolute top-1/2 h-7 w-7 -translate-y-1/2 -translate-x-1/2 cursor-grab rounded-full
                               border border-red-400/60 bg-black shadow-[0_0_18px_-2px_rgba(239,68,68,0.9)]
                               active:cursor-grabbing touch-none"
                    style={prefersReducedMotion() ? { left: `${progress * 100}%` } : { left: 0 }}
                  >
                    <span className="absolute inset-[6px] rounded-full bg-red-500" aria-hidden="true" />
                  </div>
                </div>
                <p className="mt-2 text-center text-[10px] font-mono text-neutral-600">
                  Drag or use arrow keys to scrub the lap
                </p>
              </div>

              {/* Channel readout */}
              <dl className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {channels.map((c) => (
                  <div key={c.label} className="rounded-lg border border-white/10 bg-white/[0.03] p-2.5">
                    <dt className="flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-wider text-neutral-500">
                      <span className="text-red-500">{c.icon}</span>
                      {c.label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold tabular-nums text-white">{c.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Leaderboard */}
      <Reveal>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-white/5 bg-white/[0.02] px-4 sm:px-5 py-3">
            <span className="flex items-center gap-2 text-xs font-semibold text-white">
              <Trophy className="w-4 h-4 text-red-500" aria-hidden="true" />
              Session leaderboard · concept
            </span>
            <DemoBadge />
          </div>

          <ul className="divide-y divide-white/5">
            {board.map((row, index) => (
              <li
                key={row.id}
                className="flex items-center gap-4 px-4 sm:px-5 py-3 transition-all duration-500"
                style={{ transitionProperty: 'background-color, transform' }}
              >
                <span
                  className={`w-7 text-center font-mono text-xs tabular-nums ${
                    index === 0 ? 'text-red-400' : 'text-neutral-500'
                  }`}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-sm text-neutral-200">{row.driver}</span>
                <span className="font-mono text-xs tabular-nums text-neutral-300">{row.best}</span>
                <span className="hidden sm:block w-16 text-right font-mono text-xs tabular-nums text-neutral-500">
                  {index === 0 ? '—' : row.gap}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
};

export default RaceXPPreview;
