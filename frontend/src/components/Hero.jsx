import React, { useEffect, useRef } from 'react';
import { Zap, Terminal, ArrowRight, Gamepad2, DollarSign, Monitor, BarChart3 } from 'lucide-react';

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
    <div className="relative min-h-screen bg-white overflow-hidden flex items-center justify-center antialiased font-sans">
      
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
      <div className="absolute top-1/4 left-0 w-full h-[2px] z-[2] overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent absolute animate-racer-fast opacity-80 blur-[1px]"/>
      </div>
      <div className="absolute top-1/2 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent absolute animate-racer-slow opacity-60 blur-[1px]"/>
      </div>
      <div className="absolute top-3/4 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/5 h-full bg-gradient-to-r from-transparent via-blue-500 to-transparent absolute animate-racer-fast opacity-50 blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-4">
        
        {/* Top HUD Element */}
        <div className="flex justify-center mb-3">
          <div className="flex items-center gap-4 text-xs text-gray-600 font-mono tracking-[0.2em] uppercase">
            <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-gray-300" />
            <span className="text-cyan-600">Cafe Management Solutions</span>
            <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-gray-300" />
          </div>
        </div>

        {/* Main Typography */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-black leading-tight mb-3">
          CONTROL EVERY PC. TRACK EVERY MINUTE.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">GROW YOUR CAFE.</span>
        </h1>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto font-light leading-relaxed">
            ManagerXP delivers gaming session management, intelligent billing, and real-time monitoring for modern internet and gaming cafes using AI .
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 max-w-3xl mx-auto">
          <div className="flex flex-col items-center gap-2 p-3">
            <Gamepad2 className="w-5 h-5 text-cyan-600" />
            <span className="text-xs text-gray-700 font-mono uppercase tracking-wide text-center">Gaming Session Control</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-700 font-mono uppercase tracking-wide text-center">Automated Billing</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3">
            <Monitor className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-700 font-mono uppercase tracking-wide text-center">Centralized Monitoring</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3">
            <BarChart3 className="w-5 h-5 text-yellow-600" />
            <span className="text-xs text-gray-700 font-mono uppercase tracking-wide text-center">Real-Time Analytics</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group flex items-center gap-2 px-7 py-3 bg-black text-white font-bold rounded-full 
                           transition-all duration-300 hover:bg-gray-800 active:scale-95 shadow-lg
                           relative overflow-hidden">
            {/* Shine Effect */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
            <Zap className="w-4 h-4" />
            View Products
          </button>
          
          <button className="group flex items-center gap-2 px-6 py-3 text-gray-700 font-mono text-sm transition-colors hover:text-cyan-600 border border-gray-300 rounded-full hover:border-cyan-600">
            <Terminal className="w-4 h-4" />
            Get a Free Demo
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </button>
        </div>

        {/* Speed Stats Bar */}
        <div className="mt-8 flex justify-center items-center gap-6 sm:gap-8 text-gray-600 text-xs font-mono uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
            System Active
          </div>
          <div className="h-4 w-[1px] bg-gray-300"></div>
          <div>24/7 Support</div>
          <div className="h-4 w-[1px] bg-gray-300"></div>
          <div>Secure & Reliable Software</div>
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