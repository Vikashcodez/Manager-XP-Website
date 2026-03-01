import React, { useEffect, useRef } from 'react';
import { Target, Eye, Globe, Cpu, Shield, Zap, Layers, Network } from 'lucide-react';

const MissionVisionPage = () => {
  const canvasRef = useRef(null);

  // Reusing the "Racing Code" particle logic for consistency
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

  const ecosystemItems = [
    { icon: <Cpu className="w-5 h-5" />, text: "Gaming Systems" },
    { icon: <Network className="w-5 h-5" />, text: "Cafe Operations" },
    { icon: <Zap className="w-5 h-5" />, text: "Billing & Monitoring" },
    { icon: <Layers className="w-5 h-5" />, text: "AI Analytics" },
    { icon: <Shield className="w-5 h-5" />, text: "Security & Automation" }
  ];

  const visionPoints = [
    "Every gaming cafe runs on intelligent automation",
    "Every internet cafe operates with full transparency",
    "Businesses are powered by predictive AI insights",
    "All systems are connected inside one scalable ecosystem"
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
      <div className="absolute bottom-1/4 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent absolute animate-racer-slow opacity-60 blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        
        {/* Section 1: Our Mission */}
        <div className="mb-24">
          {/* HUD Header */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4 text-xs text-gray-500 font-mono tracking-[0.2em] uppercase">
              <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
              <span className="text-cyan-400 flex items-center gap-2"><Target className="w-3 h-3"/> Core Directive</span>
              <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white mb-6">
                OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">MISSION</span>
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed mb-6">
                To empower gaming cafes, internet cafes, and digital businesses with intelligent, secure, and high-performance software solutions — while building our own integrated technology ecosystem.
              </p>
              <div className="p-4 border-l-2 border-cyan-500 bg-white/5 backdrop-blur-sm">
                <p className="text-white font-mono text-sm">
                  "We are not just developing tools. We are building a complete ecosystem."
                </p>
              </div>
            </div>

            {/* Ecosystem Visual Card */}
            <div className="bg-black/70 border border-white/20 rounded-lg p-1 backdrop-blur-md font-mono text-xs shadow-2xl relative overflow-hidden">
              {/* Window Controls */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 border border-yellow-400/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 border border-green-400/50" />
                </div>
                <span className="text-gray-500 text-xs">ecosystem.config</span>
              </div>
              
              <div className="p-5 space-y-3">
                <p className="text-gray-500 mb-2">// Unified Architecture Components:</p>
                {ecosystemItems.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-gray-300 group hover:text-cyan-400 transition-colors cursor-default">
                    <span className="text-cyan-500 opacity-50 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                    <span className="flex-1 border-b border-white/5 pb-1">{item.text}</span>
                    <span className="text-[10px] text-green-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity">CONNECTED</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Text */}
          <div className="mt-8 max-w-3xl mx-auto text-center">
            <p className="text-gray-500 text-sm">
              Our mission is to transform traditional cafe operations into <span className="text-white">smart</span>, <span className="text-white">scalable</span>, and <span className="text-white">data-driven</span> digital environments.
            </p>
          </div>
        </div>

        {/* Section Divider */}
        <div className="relative h-px bg-white/10 my-16">
          <div className="absolute left-1/2 -translate-x-1/2 -top-3 bg-[#030303] px-4 text-gray-600 text-xs font-mono tracking-widest">
            SYSTEM UPGRADE PATH
          </div>
        </div>

        {/* Section 2: Our Vision */}
        <div>
          {/* HUD Header */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-4 text-xs text-gray-500 font-mono tracking-[0.2em] uppercase">
              <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
              <span className="text-purple-400 flex items-center gap-2"><Eye className="w-3 h-3"/> Future Protocol</span>
              <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
            </div>
          </div>

          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter text-white mb-4">
              OUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">VISION</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              To build our own global ecosystem of AI-powered cafe and digital management solutions that redefine how modern digital spaces operate.
            </p>
          </div>

          {/* Vision Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            
            {/* Left: Future Vision Terminal */}
            <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm h-full relative overflow-hidden group">
               {/* Background Glow */}
               <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
               
               <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 rounded bg-purple-500/10 border border-purple-500/20">
                     <Globe className="w-5 h-5 text-purple-400" />
                   </div>
                   <h3 className="text-white font-bold">Global Ecosystem</h3>
                 </div>
                 
                 <ul className="space-y-4">
                   {visionPoints.map((point, index) => (
                     <li key={index} className="flex items-start gap-3 text-gray-400 text-sm">
                       <span className="mt-1 w-2 h-2 rounded-full bg-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.3)]" />
                       <span>{point}</span>
                     </li>
                   ))}
                 </ul>
               </div>
            </div>

            {/* Right: Evolution Card */}
            <div className="bg-black/40 border border-white/10 rounded-lg p-6 backdrop-blur-sm h-full flex flex-col justify-center relative overflow-hidden">
                {/* Decorative Lines */}
                <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-cyan-500/10 rounded-tr-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-cyan-500/10 rounded-bl-3xl" />

                <div className="text-center relative z-10">
                  <p className="text-gray-500 font-mono text-xs mb-4 tracking-widest uppercase">The Evolution</p>
                  <h3 className="text-xl font-bold text-white mb-4">
                    From Software to <span className="text-cyan-400">Intelligent Ecosystem</span>
                  </h3>
                  <div className="flex justify-center items-center gap-4 text-gray-500 text-xs font-mono">
                    <span>Management</span>
                    <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
                    <span>Automation</span>
                    <Zap className="w-3 h-3 text-yellow-400 animate-pulse" />
                    <span>AI Core</span>
                  </div>
                </div>
            </div>
          </div>

          {/* Closing Statement */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 border border-white/10 rounded-full bg-white/5 backdrop-blur-sm text-gray-400 text-sm font-mono">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)] animate-pulse"></span>
              Aiming to lead the evolution of smart business ecosystems
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

export default MissionVisionPage;