import React from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2, Monitor, Users, BarChart3,
  Cpu, CreditCard, FileText, ArrowRight
} from 'lucide-react';
import PageBackground from '../components/PageBackground';
import SectionHeading from '../components/SectionHeading';
import Reveal from '../components/Reveal';

// GamingXP Features Data
const gamingFeatures = [
  { icon: <Gamepad2 className="w-5 h-5" />, title: "Game & System Control", desc: "Centralized PC control, remote session start/stop, automation.", status: "ACTIVE" },
  { icon: <Cpu className="w-5 h-5" />, title: "Session Management", desc: "Time-based billing, membership access, tournament control.", status: "OPTIMIZED" },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Telemetry & Data", desc: "Real-time CPU/GPU usage, temp monitoring, analytics.", status: "STREAMING" },
  { icon: <CreditCard className="w-5 h-5" />, title: "Smart Billing", desc: "Automated calculation, wallet system, promo management.", status: "SECURE" },
  { icon: <FileText className="w-5 h-5" />, title: "Reports & Monitoring", desc: "Live dashboard, revenue analytics, peak hour insights.", status: "LIVE" },
  { icon: <Users className="w-5 h-5" />, title: "Custom CRM", desc: "Player management, loyalty tracking, targeted promotions.", status: "ENGAGED" },
];

// CafeXP Features Data
const cafeFeatures = [
  { icon: <Monitor className="w-5 h-5" />, title: "User & Session Control", desc: "Secure login, time-based access, remote monitoring." },
  { icon: <CreditCard className="w-5 h-5" />, title: "Automated Billing", desc: "Real-time usage billing, print integration, invoices." },
  { icon: <BarChart3 className="w-5 h-5" />, title: "Reports & Monitoring", desc: "Live dashboard, usage tracking, revenue breakdown." },
  { icon: <Users className="w-5 h-5" />, title: "Custom CRM", desc: "Profile management, visit tracking, retention programs." },
];

const ProductsPage = () => {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden antialiased font-sans text-white">

      <PageBackground streakTop="top-1/3" streakBottom="top-2/3" />

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 py-20 sm:py-24">

        <SectionHeading
          as="h1"
          eyebrow="System Modules"
          title="OUR"
          highlight="PRODUCTS"
          description={
            <>
              We build powerful, intelligent software solutions designed to manage, monitor, and grow modern digital spaces.
              Built on a <span className="text-white">unified technology ecosystem</span>.
            </>
          }
          className="mb-16 sm:mb-20"
        />

        {/* Product 1: GamingXP */}
        <Reveal className="block mb-20 sm:mb-24">
          <div className="relative">
            {/* Decorative BG Glow */}
            <div aria-hidden="true" className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-black rounded-3xl blur-3xl opacity-30" />

            <div className="relative border border-white/10 rounded-xl bg-white/[0.02] backdrop-blur-md overflow-hidden shadow-[0_0_50px_-20px_rgba(220,38,38,0.1)]">
              {/* Top HUD Bar */}
              <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Gamepad2 className="w-5 h-5 text-red-500 shrink-0" />
                  <span className="text-white font-semibold tracking-wide truncate">GamingXP</span>
                  <span className="hidden sm:inline text-[10px] font-mono text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">MODULE_01</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-red-400 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>
                  SYSTEM_ACTIVE
                </div>
              </div>

              <div className="p-6 sm:p-8 md:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Left: Info */}
                  <div className="lg:col-span-1">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 text-balance">The Ultimate Gaming Cafe Platform</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-6 text-pretty">
                      Engineered specifically for high-performance gaming environments. It gives you complete control over your gaming infrastructure.
                    </p>
                    <Link to="/demo" className="group inline-flex items-center gap-2 text-xs font-mono text-red-500 hover:text-white transition-colors">
                      Request a Demo <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Right: Feature Grid */}
                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {gamingFeatures.map((feature) => (
                      <div
                        key={feature.title}
                        className="group bg-white/[0.03] border border-white/5 p-5 rounded-lg hover:border-red-500/30 hover:bg-white/[0.05]
                                   hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2 text-red-500 min-w-0">
                            <span className="shrink-0">{feature.icon}</span>
                            <h3 className="text-sm font-medium text-white truncate">{feature.title}</h3>
                          </div>
                          <span className="text-[10px] font-mono text-neutral-600 group-hover:text-red-500 transition-colors shrink-0">{feature.status}</span>
                        </div>
                        <p className="text-xs text-neutral-500 leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Statement */}
                <div className="mt-4 pt-6 border-t border-white/5 text-center">
                  <p className="text-xs sm:text-sm font-mono text-neutral-500 text-pretty">
                    <span className="text-white">GamingXP</span> doesn't just manage your cafe — it optimizes performance, maximizes uptime, and increases profitability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Product 2: CafeXP */}
        <Reveal className="block">
          <div className="relative">
            {/* Decorative BG Glow */}
            <div aria-hidden="true" className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-black rounded-3xl blur-3xl opacity-30" />

            <div className="relative border border-white/10 rounded-xl bg-white/[0.02] backdrop-blur-md overflow-hidden shadow-[0_0_50px_-20px_rgba(220,38,38,0.1)]">
              {/* Top HUD Bar */}
              <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <Monitor className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-white font-semibold tracking-wide truncate">CafeXP</span>
                  <span className="hidden sm:inline text-[10px] font-mono text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">MODULE_02</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-red-400 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>
                  STABLE_RELEASE
                </div>
              </div>

              <div className="p-6 sm:p-8 md:p-12">
                <div className="flex flex-col lg:flex-row gap-8">

                  {/* Terminal Visual */}
                  <div className="lg:w-1/3 bg-neutral-900 border border-white/10 rounded-xl p-1 font-mono text-xs shadow-xl h-fit overflow-hidden">
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>

                    <div className="p-4 text-neutral-400 leading-loose overflow-x-auto">
                      <code>
                        <span className="text-red-500">system</span> init <span className="text-white">CafeXP</span>{'\n'}
                        <span className="text-green-500">[ OK ]</span> Loading modules...{'\n'}
                        <span className="text-green-500">[ OK ]</span> User Control: <span className="text-red-400">Enabled</span>{'\n'}
                        <span className="text-green-500">[ OK ]</span> Billing Engine: <span className="text-red-400">Active</span>{'\n'}
                        <span className="text-green-500">[ OK ]</span> Monitoring: <span className="text-red-400">Live</span>
                      </code>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="lg:w-2/3">
                    <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 text-balance">Smart Management for Internet Cafes</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed mb-8 text-pretty">
                      Designed for traditional internet cafes and browsing centers that need efficiency, security, and complete operational control.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {cafeFeatures.map((feature) => (
                        <div key={feature.title} className="flex items-start gap-4 group">
                          <div className="p-2.5 rounded-lg border border-white/10 bg-white/5 text-red-500 shrink-0 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all">
                            {feature.icon}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-medium text-white mb-1">{feature.title}</h3>
                            <p className="text-xs text-neutral-500 leading-relaxed">{feature.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Statement */}
                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                  <p className="text-xs sm:text-sm font-mono text-neutral-500 text-pretty">
                    <span className="text-white">CafeXP</span> simplifies daily operations while giving owners complete visibility and control.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Closing CTA */}
        <Reveal className="block mt-16 sm:mt-20">
          <div className="border border-white/10 rounded-xl bg-white/[0.02] backdrop-blur-sm p-8 sm:p-10 text-center">
            <h2 className="text-xl sm:text-2xl font-semibold text-white mb-3 text-balance">
              Not sure which module fits your cafe?
            </h2>
            <p className="text-neutral-400 text-sm mb-8 max-w-xl mx-auto text-pretty">
              Book a walkthrough and we'll show you how ManagerXP works with your setup.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-full text-white
                           bg-gradient-to-br from-red-700 to-red-900 border border-white/10
                           shadow-[0_0_20px_-5px_rgba(220,38,38,0.3)] hover:shadow-[0_0_28px_-5px_rgba(220,38,38,0.55)]
                           hover:scale-[1.02] active:scale-[0.98] motion-reduce:hover:scale-100 transition-all duration-300"
              >
                Book a Demo
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium rounded-full
                           text-neutral-300 bg-white/[0.05] border border-white/10 backdrop-blur-md
                           hover:bg-white/[0.08] hover:text-white hover:border-white/20 transition-all duration-300"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </Reveal>

      </div>
    </div>
  );
};

export default ProductsPage;
