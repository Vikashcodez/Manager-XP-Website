import React, { useEffect, useRef } from 'react';
import { Zap, Terminal, ArrowRight, Gamepad2, DollarSign, Monitor, BarChart3 } from 'lucide-react';

const HeroSection = () => {
  const canvasRef = useRef(null);

  // Particle Animation Logic
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

    // Create racing lines / particles
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 8 + 2, 
        length: Math.random() * 80 + 20,
        color: `rgba(${Math.random() > 0.8 ? '239, 68, 68' : '255, 255, 255'}, ${Math.random() * 0.3 + 0.1})`, // Mostly subtle white, some red
        type: Math.random() > 0.8 ? 'code' : 'line'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        
        if (p.type === 'code') {
          ctx.font = '12px monospace';
          ctx.fillStyle = 'rgba(239, 68, 68, 0.4)'; // Red syntax
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

  return (
    <div className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center antialiased font-sans">
      
      {/* --- Background Layers --- */}
      
      {/* 1. Subtle Tech Grid */}
      <div 
        className="absolute inset-0 z-0 opacity-10
                   bg-[length:60px_60px]
                   [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),
                                      linear-gradient(to_top,rgba(255,255,255,0.05)_1px,transparent_1px)]"
      />

      {/* 2. Canvas Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] opacity-60" />

      {/* 3. Radial Vignette (Focus Light) - Apple Style */}
      <div 
        className="absolute inset-0 z-[1] opacity-70
                   [background:radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(185,28,28,0.15),transparent_70%)]"
      />

      {/* 4. Moving Light Streaks (Red themed) */}
      <div className="absolute top-1/4 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-red-600 to-transparent absolute animate-racer-fast opacity-60 blur-[2px]"/>
      </div>
      <div className="absolute top-2/3 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-500 to-transparent absolute animate-racer-slow opacity-40 blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 text-center flex flex-col justify-center min-h-screen">
        
        {/* Top HUD Element */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono tracking-[0.2em] uppercase">
            <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-neutral-700" />
            <span className="text-red-500 font-semibold">Cafe Management Solutions</span>
            <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-neutral-700" />
          </div>
        </div>

        {/* Main Typography */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.1] mb-6 text-center">
          Control Every PC. Track Every Minute.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">Grow Your Cafe.</span>
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-10">
          <p className="text-base sm:text-lg text-neutral-400 max-w-2xl font-light leading-relaxed text-center">
            ManagerXP delivers gaming session management, intelligent billing, and real-time monitoring for modern internet and gaming cafes powered by AI.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
          {[
            { Icon: Gamepad2, label: 'Gaming Control' },
            { Icon: DollarSign, label: 'Auto Billing' },
            { Icon: Monitor, label: 'Live Monitor' },
            { Icon: BarChart3, label: 'Analytics' }
          ].map(({ Icon, label }) => (
            <div key={label} className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-red-500/20 transition-all duration-300 cursor-default">
              <Icon className="w-5 h-5 text-red-500 transition-colors group-hover:text-red-400" />
              <span className="text-[11px] text-neutral-300 font-medium uppercase tracking-wide text-center">{label}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons - Glassmorphism */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group relative flex items-center justify-center gap-2 px-8 py-3.5 
                           font-semibold rounded-full text-white transition-all duration-300 
                           hover:scale-[1.02] active:scale-[0.98]
                           shadow-[0_0_20px_-5px_rgba(220,38,38,0.3)]
                           hover:shadow-[0_0_25px_-5px_rgba(220,38,38,0.5)]
                           bg-gradient-to-br from-red-700 to-red-900
                           border border-white/10"
                           style={{ backdropFilter: 'blur(12px)' }}>
            <Zap className="w-4 h-4" />
            View Products
          </button>
          
          <button className="group flex items-center gap-2 px-8 py-3.5 
                           text-neutral-300 font-medium text-sm transition-all duration-300 
                           rounded-full 
                           bg-white/[0.05] border border-white/10
                           hover:bg-white/[0.08] hover:text-white hover:border-white/20
                           shadow-[0_0_15px_-10px_rgba(255,255,255,0.1)]
                           active:scale-95"
                           style={{ backdropFilter: 'blur(12px)' }}>
            <Terminal className="w-4 h-4 text-red-500" />
            Get a Free Demo
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </button>
        </div>

        {/* Status Bar */}
        <div className="mt-16 flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-neutral-500 text-xs font-mono uppercase tracking-widest">
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
          <div>Secure & Reliable</div>
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

export default HeroSection;