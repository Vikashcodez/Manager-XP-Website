import React, { useEffect, useRef } from 'react';
import { 
  Gamepad2, Monitor, Zap, Users, BarChart3, Shield, 
  Cpu, CreditCard, FileText, Terminal, ArrowRight 
} from 'lucide-react';

const ProductsPage = () => {
  const canvasRef = useRef(null);

  // Racing Code Particle Logic - Red/White Theme
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 8 + 2,
        length: Math.random() * 80 + 20,
        color: `rgba(${Math.random() > 0.8 ? '239, 68, 68' : '255, 255, 255'}, ${Math.random() * 0.3 + 0.1})`,
        type: Math.random() > 0.8 ? 'code' : 'line'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        
        if (p.type === 'code') {
          ctx.font = '12px monospace';
          ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
          ctx.fillText('{ }', p.x, p.y);
        } else {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.length, p.y);
          ctx.stroke();
        }

        p.x += p.speed;

        if (p.x > canvas.width) {
          p.x = -p.length;
          p.y = Math.random() * canvas.height;
        }
      });

      animationFrameId = window.requestAnimationFrame(render);
    };

    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

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

  return (
    <div className="relative min-h-screen bg-black overflow-hidden antialiased font-sans text-white">
      
      {/* --- Background Layers --- */}
      
      {/* 1. Tech Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]
                   bg-[length:40px_40px]
                   [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),
                                      linear-gradient(to_top,rgba(255,255,255,0.1)_1px,transparent_1px)]"
      />

      {/* 2. Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] opacity-60" />

      {/* 3. Ambient Red Glow */}
      <div 
        className="absolute inset-0 z-[1] opacity-70
                   [background:radial-gradient(ellipse_60%_50%_at_50%_30%,rgba(185,28,28,0.15),transparent_70%)]"
      />

      {/* 4. Racer Light Streaks */}
      <div className="absolute top-1/3 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-600/60 to-transparent absolute animate-racer-fast blur-[1px]"/>
      </div>
      <div className="absolute top-2/3 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent absolute animate-racer-slow blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-12 flex flex-col min-h-screen">
        
        {/* Header Section */}
        <div className="text-center mb-8 lg:mb-12">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono tracking-[0.2em] uppercase">
              <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-neutral-700" />
              <span className="text-red-500">System Modules</span>
              <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-neutral-700" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-4 lg:mb-6">
            OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">PRODUCTS</span>
          </h1>
          
          <p className="text-neutral-400 max-w-3xl mx-auto text-base lg:text-lg font-light px-4">
            We build powerful, intelligent software solutions designed to manage, monitor, and grow modern digital spaces. 
            Built on a <span className="text-white">unified technology ecosystem</span>.
          </p>
        </div>

        {/* Products Grid - Horizontal Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Product 1: GamingXP */}
          <div className="relative">
            {/* Decorative BG Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-black rounded-3xl blur-3xl opacity-30" />
            
            <div className="relative border border-white/10 rounded-xl bg-white/[0.02] backdrop-blur-md overflow-hidden shadow-[0_0_50px_-20px_rgba(220,38,38,0.1)] h-full flex flex-col">
              {/* Top HUD Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-5 h-5 text-red-500" />
                  <span className="text-white font-semibold tracking-wide">GamingXP</span>
                  <span className="hidden sm:inline text-[10px] font-mono text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">MODULE_01</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>
                  SYSTEM_ACTIVE
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-3">The Ultimate Gaming Cafe Platform</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      Engineered specifically for high-performance gaming environments. It gives you complete control over your gaming infrastructure.
                    </p>
                  </div>

                  {/* Feature Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {gamingFeatures.map((feature, index) => (
                      <div 
                        key={index}
                        className="group bg-white/[0.03] border border-white/5 p-4 rounded-lg hover:border-red-500/30 hover:bg-white/[0.05] transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-2">
                           <div className="flex items-center gap-2 text-red-500">
                             {feature.icon}
                             <h3 className="text-xs font-medium text-white">{feature.title}</h3>
                           </div>
                           <span className="text-[9px] font-mono text-neutral-600 group-hover:text-red-500 transition-colors">{feature.status}</span>
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                          {feature.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Statement */}
                <div className="mt-6 pt-4 border-t border-white/5 text-center">
                  <p className="text-xs font-mono text-neutral-500">
                    <span className="text-white">GamingXP</span> doesn't just manage your cafe — it optimizes performance, maximizes uptime, and increases profitability.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product 2: CafeXP */}
          <div className="relative">
            {/* Decorative BG Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-red-500/10 to-black rounded-3xl blur-3xl opacity-30" />
            
            <div className="relative border border-white/10 rounded-xl bg-white/[0.02] backdrop-blur-md overflow-hidden shadow-[0_0_50px_-20px_rgba(220,38,38,0.1)] h-full flex flex-col">
              {/* Top HUD Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <Monitor className="w-5 h-5 text-red-400" />
                  <span className="text-white font-semibold tracking-wide">CafeXP</span>
                  <span className="hidden sm:inline text-[10px] font-mono text-neutral-500 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">MODULE_02</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-red-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]"></span>
                  STABLE_RELEASE
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-white mb-3">Smart Management for Internet Cafes</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      Designed for traditional internet cafes and browsing centers that need efficiency, security, and complete operational control.
                    </p>
                  </div>

                  {/* Terminal Visual */}
                  <div className="bg-neutral-900 border border-white/10 rounded-xl p-1 font-mono text-xs shadow-xl mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                    
                    {/* Clean Multi-line Code Block */}
                    <div className="p-4 text-neutral-400 leading-loose">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cafeFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className="p-2 rounded-lg border border-white/10 bg-white/5 text-red-500 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all flex-shrink-0">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-xs font-medium text-white mb-1">{feature.title}</h3>
                          <p className="text-[11px] text-neutral-500 leading-relaxed">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Statement */}
                <div className="mt-6 pt-4 border-t border-white/5 text-center">
                  <p className="text-xs font-mono text-neutral-500">
                    <span className="text-white">CafeXP</span> simplifies daily operations while giving owners complete visibility and control.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes racer-fast {
          0% { transform: translateX(-100vw); }
          100% { transform: translateX(100vw); }
        }
        .animate-racer-fast {
          animation: racer-fast 4s linear infinite;
        }

        @keyframes racer-slow {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100vw); }
        }
        .animate-racer-slow {
          animation: racer-slow 9s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;
