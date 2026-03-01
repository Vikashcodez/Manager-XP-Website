import React, { useEffect, useRef } from 'react';
import { 
  Gamepad2, Monitor, Zap, Users, BarChart3, Shield, 
  Cpu, CreditCard, FileText, Terminal, ArrowRight 
} from 'lucide-react';

const ProductsPage = () => {
  const canvasRef = useRef(null);

  // "Racing Code" particle logic
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

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 15 + 5,
        length: Math.random() * 100 + 50,
        color: `rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, ${Math.random() * 0.5 + 0.1})`,
        type: Math.random() > 0.7 ? 'code' : 'line'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        
        if (p.type === 'code') {
          ctx.font = '14px monospace';
          ctx.fillStyle = p.color;
          ctx.fillText('{ }', p.x, p.y);
        } else {
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
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
    <div className="relative min-h-screen bg-[#030303] overflow-hidden antialiased font-sans">
      
      {/* --- Background Layers --- */}
      <div 
        className="absolute inset-0 z-0 opacity-20
                   bg-[length:40px_40px]
                   [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),
                                      linear-gradient(to_top,rgba(255,255,255,0.05)_1px,transparent_1px)]
                   [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]"
      />
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] opacity-40" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] z-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent" />

      {/* Racer Light Streaks */}
      <div className="absolute top-1/3 left-0 w-full h-[2px] z-[2] overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent absolute animate-racer-fast opacity-80 blur-[1px]"/>
      </div>
      <div className="absolute top-2/3 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent absolute animate-racer-slow opacity-60 blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-xs text-gray-500 font-mono tracking-[0.2em] uppercase">
              <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
              <span className="text-cyan-400">System Modules</span>
              <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6">
            OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">PRODUCTS</span>
          </h1>
          
          <p className="text-gray-400 max-w-3xl mx-auto text-lg font-light">
            We build powerful, intelligent software solutions designed to manage, monitor, and grow modern digital spaces. 
            Built on a <span className="text-white">unified technology ecosystem</span>.
          </p>
        </div>

        {/* Product 1: GamingXP */}
        <div className="mb-24 relative">
          {/* Decorative BG Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl blur-3xl opacity-30" />
          
          <div className="relative border border-white/10 rounded-lg bg-black/50 backdrop-blur-md overflow-hidden">
            {/* Top HUD Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5 text-cyan-400" />
                <span className="text-white font-bold tracking-wide">GamingXP</span>
                <span className="hidden sm:inline text-[10px] font-mono text-gray-500 bg-black/30 px-2 py-0.5 rounded-full border border-white/10">MODULE_01</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-green-400">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                SYSTEM_ACTIVE
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Left: Info */}
                <div className="lg:col-span-1">
                  <h2 className="text-2xl font-bold text-white mb-2">The Ultimate Gaming Cafe Platform</h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    Engineered specifically for high-performance gaming environments. It gives you complete control over your gaming infrastructure.
                  </p>
                  <button className="group flex items-center gap-2 text-xs font-mono text-cyan-400 hover:text-white transition-colors">
                    Explore Docs <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                {/* Right: Feature Grid */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {gamingFeatures.map((feature, index) => (
                    <div 
                      key={index}
                      className="group bg-white/5 border border-white/10 p-4 rounded hover:border-cyan-500/50 hover:bg-white/[0.07] transition-all duration-300"
                    >
                      <div className="flex items-center justify-between mb-2">
                         <div className="flex items-center gap-2 text-cyan-400">
                           {feature.icon}
                           <h3 className="text-sm font-bold text-white">{feature.title}</h3>
                         </div>
                         <span className="text-[10px] font-mono text-gray-600 group-hover:text-cyan-400 transition-colors">{feature.status}</span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Statement */}
              <div className="mt-4 pt-6 border-t border-white/5 text-center">
                <p className="text-sm font-mono text-gray-500">
                  <span className="text-white">GamingXP</span> doesn’t just manage your cafe — it optimizes performance, maximizes uptime, and increases profitability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Product 2: CafeXP */}
        <div className="relative">
          {/* Decorative BG Glow */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-3xl blur-3xl opacity-30" />
          
          <div className="relative border border-white/10 rounded-lg bg-black/50 backdrop-blur-md overflow-hidden">
            {/* Top HUD Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-purple-400" />
                <span className="text-white font-bold tracking-wide">CafeXP</span>
                <span className="hidden sm:inline text-[10px] font-mono text-gray-500 bg-black/30 px-2 py-0.5 rounded-full border border-white/10">MODULE_02</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-mono text-purple-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"></span>
                STABLE_RELEASE
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row gap-8">
                
                {/* Terminal Visual - FIXED LAYOUT */}
                <div className="lg:w-1/3 bg-black/70 border border-white/10 rounded-lg p-1 font-mono text-xs shadow-xl h-fit">
                  <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10">
                    <div className="w-2 h-2 rounded-full bg-red-500/80" />
                    <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                    <div className="w-2 h-2 rounded-full bg-green-500/80" />
                  </div>
                  
                  {/* Clean Multi-line Code Block */}
                  <div className="p-4 text-gray-400 leading-relaxed">
                    <code>
                      <span className="text-purple-400">system</span> init <span className="text-white">CafeXP</span>{'\n'}
                      <span className="text-green-400">[ OK ]</span> Loading modules...{'\n'}
                      <span className="text-green-400">[ OK ]</span> User Control: <span className="text-cyan-400">Enabled</span>{'\n'}
                      <span className="text-green-400">[ OK ]</span> Billing Engine: <span className="text-cyan-400">Active</span>{'\n'}
                      <span className="text-green-400">[ OK ]</span> Monitoring: <span className="text-cyan-400">Live</span>
                    </code>
                  </div>
                </div>

                {/* Features */}
                <div className="lg:w-2/3">
                  <h2 className="text-2xl font-bold text-white mb-2">Smart Management for Internet Cafes</h2>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Designed for traditional internet cafes and browsing centers that need efficiency, security, and complete operational control.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {cafeFeatures.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3 group">
                        <div className="p-2 rounded bg-white/5 border border-white/10 text-purple-400 group-hover:border-purple-500/50 transition-colors">
                          {feature.icon}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-white mb-1">{feature.title}</h3>
                          <p className="text-xs text-gray-500 leading-relaxed">{feature.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Bottom Statement */}
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-sm font-mono text-gray-500">
                  <span className="text-white">CafeXP</span> simplifies daily operations while giving owners complete visibility and control.
                </p>
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
          animation: racer-fast 3s linear infinite;
        }

        @keyframes racer-slow {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100vw); }
        }
        .animate-racer-slow {
          animation: racer-slow 7s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProductsPage;