import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Terminal, ArrowRight, Gamepad2, DollarSign, Monitor, BarChart3 } from 'lucide-react';
import PageBackground from './PageBackground';
import DashboardPreview from './DashboardPreview';

const highlights = [
  { Icon: Gamepad2, label: 'Gaming Control' },
  { Icon: DollarSign, label: 'Auto Billing' },
  { Icon: Monitor, label: 'Live Monitor' },
  { Icon: BarChart3, label: 'Analytics' }
];

const HeroSection = () => {
  return (
    <section className="relative bg-black overflow-hidden flex items-center justify-center antialiased font-sans">

      <PageBackground variant="hero" streakTop="top-1/4" streakBottom="top-2/3" />

      {/* --- Main Content --- */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 text-center pt-24 pb-20">

        {/* Top HUD Element - Welcome Message */}
        <div className="flex justify-center mb-6 animate-enter-up">
          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-neutral-500 font-mono tracking-[0.15em] sm:tracking-[0.2em] uppercase">
            <span className="w-6 sm:w-10 h-[1px] shrink-0 bg-gradient-to-r from-transparent to-neutral-700" />
            <span className="text-red-500 font-semibold">Welcome to ManagerXP Private Limited</span>
            <span className="w-6 sm:w-10 h-[1px] shrink-0 bg-gradient-to-l from-transparent to-neutral-700" />
          </div>
        </div>

        {/* Main Typography */}
        <h1
          className="text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white leading-[1.1] mb-6 text-balance animate-enter-up"
          style={{ animationDelay: '90ms' }}
        >
          Control Every PC. Track Every Minute.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Grow Your Cafe.</span>
        </h1>

        <p
          className="text-base sm:text-lg text-neutral-400 max-w-2xl mx-auto font-light leading-relaxed mb-10 text-pretty animate-enter-up"
          style={{ animationDelay: '180ms' }}
        >
          ManagerXP delivers gaming session management, intelligent billing, and real-time monitoring for modern internet and gaming cafes powered by AI.
        </p>

        {/* Feature Highlights Grid */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-12 max-w-3xl mx-auto animate-enter-up"
          style={{ animationDelay: '270ms' }}
        >
          {highlights.map((highlight) => (
            <div
              key={highlight.label}
              className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02]
                         hover:bg-white/[0.05] hover:border-red-500/25 hover:-translate-y-0.5
                         transition-all duration-300 cursor-default motion-reduce:hover:translate-y-0"
            >
              <highlight.Icon className="w-5 h-5 text-red-500 transition-transform duration-300 group-hover:scale-110 group-hover:text-red-400 motion-reduce:group-hover:scale-100" />
              <span className="text-[11px] text-neutral-300 font-medium uppercase tracking-wide text-center">{highlight.label}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-stretch sm:items-center animate-enter-up"
          style={{ animationDelay: '360ms' }}
        >
          <Link
            to="/products"
            className="group relative flex items-center justify-center gap-2 px-8 py-3.5
                       text-sm font-semibold rounded-full text-white transition-all duration-300
                       hover:scale-[1.02] active:scale-[0.98] motion-reduce:hover:scale-100
                       shadow-[0_0_20px_-5px_rgba(220,38,38,0.3)]
                       hover:shadow-[0_0_28px_-5px_rgba(220,38,38,0.55)]
                       bg-gradient-to-br from-red-700 to-red-900
                       border border-white/10 backdrop-blur-md"
          >
            <Zap className="w-4 h-4" />
            View Products
          </Link>

          <Link
            to="/demo"
            className="group flex items-center justify-center gap-2 px-8 py-3.5
                       text-neutral-300 font-medium text-sm transition-all duration-300
                       rounded-full
                       bg-white/[0.05] border border-white/10 backdrop-blur-md
                       hover:bg-white/[0.08] hover:text-white hover:border-white/20
                       shadow-[0_0_15px_-10px_rgba(255,255,255,0.1)]
                       active:scale-95 motion-reduce:active:scale-100"
          >
            <Terminal className="w-4 h-4 text-red-500" />
            Get a Free Demo
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>
        </div>

        {/* Product preview */}
        <div className="mt-14 sm:mt-16 animate-enter-up" style={{ animationDelay: '450ms' }}>
          <DashboardPreview />
        </div>

        {/* Status Bar */}
        <div
          className="mt-12 flex flex-wrap justify-center items-center gap-x-6 gap-y-3 sm:gap-x-8 text-neutral-500 text-[11px] sm:text-xs font-mono uppercase tracking-widest animate-enter-up"
          style={{ animationDelay: '540ms' }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            System Active
          </div>
          <div className="hidden sm:block h-4 w-[1px] bg-neutral-800"></div>
          <div>24/7 Support</div>
          <div className="hidden sm:block h-4 w-[1px] bg-neutral-800"></div>
          <div>Secure &amp; Reliable</div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
