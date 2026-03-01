import React, { useEffect, useRef } from 'react';
import { 
  Zap, Shield, Gauge, Gamepad2, Monitor, Brain, BarChart3, 
  Code, CheckCircle, ArrowRight, Terminal, Cpu, Wifi 
} from 'lucide-react';

const WhyUsPage = () => {
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

  const features = [
    {
      icon: <Gamepad2 className="w-6 h-6 text-purple-400" />,
      title: "Built for Gaming Businesses",
      subtitle: "Not Just Software",
      description: "We build high-performance gaming café management platforms designed for how you actually operate.",
      list: ["Game time tracking", "Automated billing", "Tournament management", "PC control & monitoring"]
    },
    {
      icon: <Monitor className="w-6 h-6 text-cyan-400" />,
      title: "Complete Internet Café Management",
      subtitle: "All-in-One Dashboard",
      description: "From small browsing centers to large cyber hubs. Everything you need to run efficiently.",
      list: ["User login control", "Time-based billing", "Bandwidth monitoring", "Security & activity tracking"]
    },
    {
      icon: <Brain className="w-6 h-6 text-green-400" />,
      title: "AI-Powered Smart Solutions",
      subtitle: "Intelligent Operations",
      description: "Integrate Artificial Intelligence to give your business an edge. Your café becomes intelligent.",
      list: ["Smart usage prediction", "Revenue forecasting", "Security anomaly detection", "Customer behavior analysis"]
    },
    {
      icon: <Gauge className="w-6 h-6 text-yellow-400" />,
      title: "High Performance Architecture",
      subtitle: "Scalable & Modern",
      description: "Built with modern technologies. Whether you run 10 systems or 1000 — we grow with you.",
      list: ["React-based dashboards", "Cloud-ready backend", "Real-time monitoring", "Scalable database"]
    },
    {
      icon: <Shield className="w-6 h-6 text-red-400" />,
      title: "Security First Approach",
      subtitle: "Protected Data",
      description: "Your systems and customer data are protected with enterprise-grade protocols.",
      list: ["Encrypted communication", "Role-based admin access", "Secure authentication", "Backup & recovery"]
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
      title: "Data-Driven Decisions",
      subtitle: "No Guesswork",
      description: "Make smarter business decisions with real-time insights and comprehensive reporting.",
      list: ["Revenue dashboards", "Peak hour analysis", "Usage heatmaps", "AI-based insights"]
    }
  ];

  return (
    <div className="relative min-h-screen bg-[#030303] overflow-hidden antialiased font-sans">
      
      {/* --- Background Layers (Identical Style) --- */}
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
      <div className="absolute top-1/4 left-0 w-full h-[2px] z-[2] overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent absolute animate-racer-fast opacity-80 blur-[1px]"/>
      </div>
      <div className="absolute bottom-1/3 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent absolute animate-racer-slow opacity-60 blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-xs text-gray-500 font-mono tracking-[0.2em] uppercase">
              <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
              <span className="text-cyan-400">Technology Ecosystem</span>
              <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-white mb-4">
            WHY <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">CHOOSE US?</span>
          </h1>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light">
            We don’t just sell software. We build technology ecosystems.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white/5 border border-white/10 rounded-md p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:bg-white/[0.07] flex flex-col h-full"
            >
              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                 <div className="p-2 rounded bg-black/50 border border-white/10">
                    {feature.icon}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-gray-500 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]"></span>
                    Active
                  </div>
              </div>

              <div className="mb-4">
                <span className="text-xs font-mono text-cyan-400/80 tracking-wider">{feature.subtitle}</span>
                <h3 className="text-xl font-bold text-white mt-1">{feature.title}</h3>
              </div>

              <p className="text-gray-400 text-sm mb-4 leading-relaxed flex-grow">
                {feature.description}
              </p>

              {/* Feature List */}
              <ul className="space-y-2 pt-4 border-t border-white/5">
                {feature.list.map((item, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-gray-500 font-mono">
                    <Zap className="w-3 h-3 text-purple-400/50" />
                    {item}
                  </li>
                ))}
              </ul>
              
              {/* Decorative Corner */}
              <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-cyan-500/0 group-hover:border-cyan-500/30 transition-colors rounded-br-md" />
            </div>
          ))}
        </div>

        {/* Custom Development Section (Wide Card) */}
        <div className="bg-black/70 border border-white/20 rounded-lg p-1 backdrop-blur-md font-mono text-xs shadow-2xl relative overflow-hidden">
            {/* Window Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 border border-yellow-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 border border-green-400/50" />
              </div>
              <span className="text-gray-500 text-xs">custom_solutions.exe</span>
              <div className="flex items-center gap-2 text-gray-600">
                <Cpu className="w-3 h-3" />
                <span>Optimized</span>
              </div>
            </div>
            
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                        <Code className="w-6 h-6 text-cyan-400" />
                        <h3 className="text-lg font-bold text-white tracking-wide">Custom Development & AI Integration</h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed mb-4">
                        Need something unique? We provide custom gaming café solutions, AI model integration, automation tools, and full-stack development support.
                    </p>
                    <div className="flex flex-wrap gap-2">
                         <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">Automation Tools</span>
                         <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">AI Models</span>
                         <span className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] text-gray-400">Business Digitization</span>
                    </div>
                </div>
                <button className="group flex items-center gap-3 px-6 py-3 bg-white text-black font-bold rounded-full 
                           transition-all duration-300 hover:bg-gray-100 active:scale-95 shadow-[0_0_30px_-5px_rgba(255,255,255,0.2)]
                           relative overflow-hidden whitespace-nowrap">
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

export default WhyUsPage;