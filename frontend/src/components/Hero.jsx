import React, { useEffect, useRef } from 'react';
import { Zap, Terminal, ArrowRight, Gamepad2, Wifi } from 'lucide-react';

const HeroSection = () => {
  const canvasRef = useRef(null);

  // Simple logic to create "Racing Code" particles
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

    // Create code lines / racing stripes
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: Math.random() * 15 + 5, // Racing speed
        length: Math.random() * 100 + 50,
        color: `rgba(${Math.random() > 0.5 ? '147, 51, 234' : '59, 130, 246'}, ${Math.random() * 0.5 + 0.1})`, // Purple or Blue
        type: Math.random() > 0.7 ? 'code' : 'line'
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        // Draw the element
        ctx.beginPath();
        
        if (p.type === 'code') {
          // Draw Code Syntax (e.g. "{ }", "/>", "//")
          ctx.font = '14px monospace';
          ctx.fillStyle = p.color;
          ctx.fillText('{ }', p.x, p.y);
        } else {
          // Draw Racing Speed Line
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 2;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.length, p.y);
          ctx.stroke();
        }

        // Move element
        p.x += p.speed;

        // Reset if off screen
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
    <div className="relative min-h-screen bg-[#030303] overflow-hidden flex items-center justify-center antialiased font-sans">
      
      {/* --- Background Layers --- */}
      
      {/* 1. Racing Circuit / PCB Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-20
                   bg-[length:40px_40px]
                   [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),
                                      linear-gradient(to_top,rgba(255,255,255,0.05)_1px,transparent_1px)]
                   [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]"
      />

      {/* 2. The "Racing Code" Canvas Animation */}
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] opacity-40" />

      {/* 3. Road/Track Horizon Effect (Bottom) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[40%] z-0
                   bg-gradient-to-t from-purple-900/10 via-transparent to-transparent"
      />
      
      {/* 4. Moving "Light" Streaks (The Racer) */}
      <div className="absolute top-1/3 left-0 w-full h-[2px] z-[2] overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent absolute animate-racer-fast opacity-80 blur-[1px]"/>
      </div>
      <div className="absolute top-2/3 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent absolute animate-racer-slow opacity-60 blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-24 pb-4">
        
        {/* Top HUD Element */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-4 text-xs text-gray-500 font-mono tracking-[0.2em] uppercase">
            <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-cyan-400">Cafe Management Solutions</span>
            <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
          </div>
        </div>

        {/* Main Typography */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white leading-none mb-2">
          CAFE SOFTWARE
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-5">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-gray-400">
            FOR <span className="text-white font-semibold">GAMING & NON-GAMING</span>
          </h2>
        </div>

        {/* Feature Tags */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <div className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-xs text-gray-400 bg-white/5 backdrop-blur-sm">
            <Wifi className="w-4 h-4 text-blue-400" /> Internet Cafe Software
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-xs text-gray-400 bg-white/5 backdrop-blur-sm">
            <Gamepad2 className="w-4 h-4 text-green-400" /> Gaming Cafe Software
          </div>
          <div className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-xs text-gray-400 bg-white/5 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-yellow-400 animate-pulse" /> High Performance
          </div>
        </div>

        {/* Code Editor Style Description */}
        <div className="max-w-2xl mx-auto mb-6 text-left md:text-center bg-black/70 border border-white/20 rounded-lg p-3 backdrop-blur-md font-mono text-xs shadow-2xl relative overflow-hidden">
          {/* Window Controls */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 border border-yellow-400/50" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 border border-green-400/50" />
          </div>
          
          <pre className="text-gray-400 mt-2 overflow-x-auto">
            <code>
              <span className="text-purple-400">const</span> <span className="text-cyan-400">cafe</span> = <span className="text-yellow-300">new</span> CafeManager({'{'} type: <span className="text-green-400">'gaming'</span> {'}'});{'\n'}
              cafe.<span className="text-white">startSession</span>(); <span className="text-gray-600">// Billing, Monitor & Control</span>
            </code>
          </pre>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full 
                           transition-all duration-300 hover:bg-gray-100 active:scale-95 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]
                           relative overflow-hidden">
            {/* Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12" />
            <Zap className="w-5 h-5" />
            View Products
          </button>
          
          <button className="group flex items-center gap-2 px-6 py-4 text-gray-400 font-mono text-sm transition-colors hover:text-cyan-400">
            <Terminal className="w-4 h-4" />
            Get a Demo
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </button>
        </div>

        {/* Speed Stats Bar */}
        <div className="mt-8 flex justify-center items-center gap-8 text-gray-500 text-xs font-mono uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
            System Active
          </div>
          <div className="h-4 w-[1px] bg-gray-800"></div>
          <div>24/7 Support</div>
          <div className="h-4 w-[1px] bg-gray-800"></div>
          <div>Trusted Software</div>
        </div>
      </div>

      {/* Custom CSS Animations */}
      <style>{`
        /* Fast Racer Animation */
        @keyframes racer-fast {
          0% { transform: translateX(-100vw); }
          100% { transform: translateX(100vw); }
        }
        .animate-racer-fast {
          animation: racer-fast 3s linear infinite;
        }

        /* Slow Racer Animation */
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

export default HeroSection;