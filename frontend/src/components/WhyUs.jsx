import React, { useEffect, useRef } from 'react';
import { 
  Zap, Shield, Gauge, Gamepad2, Monitor, Brain, BarChart3, 
  Code, CheckCircle, ArrowRight, Terminal, Cpu, Wifi 
} from 'lucide-react';

const WhyUsPage = () => {
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

  const features = [
    {
      icon: <Gamepad2 className="w-6 h-6 text-red-500" />,
      title: "Built for Gaming Businesses",
      subtitle: "Not Just Software",
      description: "We build high-performance gaming cafe management platforms designed for how you actually operate.",
      list: ["Game time tracking", "Automated billing", "Tournament management", "PC control & monitoring"]
    },
    {
      icon: <Monitor className="w-6 h-6 text-red-400" />,
      title: "Complete Internet Cafe Management",
      subtitle: "All-in-One Dashboard",
      description: "From small browsing centers to large cyber hubs. Everything you need to run efficiently.",
      list: ["User login control", "Time-based billing", "Bandwidth monitoring", "Security & activity tracking"]
    },
    {
      icon: <Brain className="w-6 h-6 text-red-500" />,
      title: "AI-Powered Smart Solutions",
      subtitle: "Intelligent Operations",
      description: "Integrate Artificial Intelligence to give your business an edge. Your cafe becomes intelligent.",
      list: ["Smart usage prediction", "Revenue forecasting", "Security anomaly detection", "Customer behavior analysis"]
    },
    {
      icon: <Gauge className="w-6 h-6 text-red-400" />,
      title: "High Performance Architecture",
      subtitle: "Scalable & Modern",
      description: "Built with modern technologies. Whether you run 10 systems or 1000 — we grow with you.",
      list: ["React-based dashboards", "Cloud-ready backend", "Real-time monitoring", "Scalable database"]
    },
    {
      icon: <Shield className="w-6 h-6 text-red-500" />,
      title: "Security First Approach",
      subtitle: "Protected Data",
      description: "Your systems and customer data are protected with enterprise-grade protocols.",
      list: ["Encrypted communication", "Role-based admin access", "Secure authentication", "Backup & recovery"]
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-red-400" />,
      title: "Data-Driven Decisions",
      subtitle: "No Guesswork",
      description: "Make smarter business decisions with real-time insights and comprehensive reporting.",
      list: ["Revenue dashboards", "Peak hour analysis", "Usage heatmaps", "AI-based insights"]
    }
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
      <div className="absolute top-1/4 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-600/60 to-transparent absolute animate-racer-fast blur-[1px]"/>
      </div>
      <div className="absolute bottom-1/3 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent absolute animate-racer-slow blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono tracking-[0.2em] uppercase">
              <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-neutral-700" />
              <span className="text-red-500">Technology Ecosystem</span>
              <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-neutral-700" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white mb-4">
            WHY <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-800">CHOOSE US?</span>
          </h1>
          
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-light">
            We don’t just sell software. We build technology ecosystems.
          </p>
        </div>

        {/* Feature Grid - Glassmorphism Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm 
                         transition-all duration-300 hover:bg-white/[0.05] hover:border-red-500/30
                         flex flex-col h-full shadow-[0_0_30px_-10px_rgba(0,0,0,0.5)]"
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-5">
                 <div className="p-2 rounded-lg border border-white/10 bg-white/5 transition-colors group-hover:border-red-500/30 group-hover:bg-red-500/10">
                    {feature.icon}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_rgba(220,38,38,0.5)]"></span>
                    Active
                  </div>
              </div>

              <div className="mb-4">
                <span className="text-xs font-mono text-red-500/70 tracking-wider">{feature.subtitle}</span>
                <h3 className="text-lg font-semibold text-white mt-1">{feature.title}</h3>
              </div>

              <p className="text-neutral-400 text-sm mb-4 leading-relaxed flex-grow">
                {feature.description}
              </p>

              {/* Feature List */}
              <ul className="space-y-2.5 pt-4 border-t border-white/5">
                {feature.list.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-neutral-300 font-mono">
                    <Zap className="w-3 h-3 text-red-500" />
                    {item}
                  </li>
                ))}
              </ul>
              
              {/* Decorative Corner */}
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-white/0 group-hover:border-red-500/20 transition-colors rounded-br-xl" />
            </div>
          ))}
        </div>

        {/* Custom Development Section (Wide Card) */}
        <div className="bg-neutral-900/50 border border-white/10 rounded-xl backdrop-blur-md font-mono text-xs relative overflow-hidden shadow-[0_0_50px_-20px_rgba(220,38,38,0.1)]">
            {/* Window Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-neutral-600 text-xs">custom_solutions.exe</span>
              <div className="flex items-center gap-2 text-neutral-600">
                <Cpu className="w-3 h-3" />
                <span>Optimized</span>
              </div>
            </div>
            
            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <Code className="w-6 h-6 text-red-500" />
                        <h3 className="text-lg font-semibold text-white tracking-wide">Custom Development & AI Integration</h3>
                    </div>
                    <p className="text-neutral-400 leading-relaxed mb-6">
                        Need something unique? We provide custom gaming cafe solutions, AI model integration, automation tools, and full-stack development support.
                    </p>
                    <div className="flex flex-wrap gap-2">
                         <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] text-red-400">Automation Tools</span>
                         <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] text-red-400">AI Models</span>
                         <span className="px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] text-red-400">Business Digitization</span>
                    </div>
                </div>
                <button className="group relative flex items-center justify-center gap-3 px-8 py-3.5 
                           text-sm font-semibold rounded-full text-white transition-all duration-300 
                           bg-gradient-to-br from-red-700 to-red-900
                           border border-white/10
                           hover:scale-[1.02] active:scale-[0.98]
                           shadow-[0_0_20px_-5px_rgba(220,38,38,0.3)]">
                    <Zap className="w-4 h-4" />
                    Request Custom Build
                </button>
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

export default WhyUsPage;