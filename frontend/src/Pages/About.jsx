import React, { useEffect, useRef } from 'react';
import { 
  Gamepad2, Monitor, Brain, Target, Eye, Zap, 
  Shield, Cpu, BarChart3, Users, Clock, CheckCircle 
} from 'lucide-react';

const AboutPage = () => {
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

  const whyUsPoints = [
    "Built specifically for gaming & internet cafes",
    "Real-time monitoring & reporting",
    "Advanced telemetry data tracking",
    "Custom CRM integration",
    "AI-ready infrastructure",
    "Scalable architecture",
    "Security-first approach"
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
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-12 flex flex-col min-h-screen">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono tracking-[0.2em] uppercase">
              <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-neutral-700" />
              <span className="text-red-500">System Identity</span>
              <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-neutral-700" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white mb-6">
            ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">MANAGERXP</span>
          </h1>
          
          <p className="text-neutral-400 max-w-3xl mx-auto text-lg font-light">
            A next-generation cafe software and AI solutions provider dedicated to transforming how digital spaces operate.
          </p>
        </div>

        {/* Section 1: Who We Are & Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Who We Are */}
          <div className="bg-white/[0.02] border border-white/10 rounded-xl p-8 backdrop-blur-sm relative overflow-hidden group hover:border-red-500/30 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-white/5 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-red-500" />
              Who We Are
            </h3>
            <p className="text-neutral-300 text-sm leading-relaxed mb-4">
              Founded in <span className="text-white">2026</span>, ManagerXP is a next-generation cafe software and AI solutions provider. We specialize in building intelligent management platforms that combine automation, real-time monitoring, billing systems, and AI-driven analytics.
            </p>
            <p className="text-neutral-500 text-sm leading-relaxed">
              From high-performance gaming arenas to traditional cyber cafes, our solutions are designed to simplify operations, improve efficiency, and maximize profitability.
            </p>
          </div>

          {/* Our Story - Terminal Style */}
          <div className="bg-neutral-900 border border-white/10 rounded-xl p-1 font-mono text-xs shadow-xl relative overflow-hidden h-full flex flex-col">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="text-neutral-600 ml-2 text-[10px]">origin_story.log</span>
            </div>
            <div className="p-5 flex-1 overflow-auto">
              <pre className="text-neutral-400 leading-relaxed whitespace-pre-wrap">
                <code>
<span className="text-red-500">const</span> vision = <span className="text-yellow-400">"Change outdated systems"</span>;{'\n'}
{'\n'}
<span className="text-neutral-600">/* Traditional systems were fragmented. */</span>{'\n'}
<span className="text-red-400">managerXP</span>.init({'{'}
  integration: [<span className="text-green-400">'Gaming Session Control'</span>],{'\n'}
  monitoring: [<span className="text-green-400">'Real-time System Data'</span>],{'\n'}
  intelligence: [<span className="text-green-400">'AI Business Logic'</span>],{'\n'}
  billing: <span className="text-red-400">Automated</span>{'\n'}
{'}'});{'\n'}
{'\n'}
<span className="text-neutral-600">// Goal: Smart, scalable, future-ready.</span>
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Section 2: What We Do */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-semibold text-white mb-2">What We Do</h2>
            <p className="text-neutral-500 text-sm">We don't just manage cafes — we build intelligent digital ecosystems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: GamingXP */}
            <div className="bg-white/[0.02] border border-white/10 p-6 rounded-xl hover:border-red-500/30 transition-all group">
              <div className="p-3 border border-white/10 bg-white/5 rounded-lg w-fit mb-4 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all">
                <Gamepad2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Gaming Cafe Software</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                High-performance systems with telemetry data, session control, tournament handling, and smart billing.
              </p>
            </div>

            {/* Card 2: CafeXP */}
            <div className="bg-white/[0.02] border border-white/10 p-6 rounded-xl hover:border-red-500/30 transition-all group">
              <div className="p-3 border border-white/10 bg-white/5 rounded-lg w-fit mb-4 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all">
                <Monitor className="w-6 h-6 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Internet Cafe Software</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Secure user access management, automated billing, centralized control, and real-time reporting.
              </p>
            </div>

            {/* Card 3: AI Solutions */}
            <div className="bg-white/[0.02] border border-white/10 p-6 rounded-xl hover:border-red-500/30 transition-all group">
              <div className="p-3 border border-white/10 bg-white/5 rounded-lg w-fit mb-4 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all">
                <Brain className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Solutions</h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Predict peak hours, analyze behavior, forecast revenue, detect anomalies, and optimize operations.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Vision */}
          <div className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative border border-white/10 p-8 rounded-xl bg-white/[0.02] backdrop-blur-sm h-full">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-semibold text-white">Our Vision</h3>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                To become a global leader in cafe management and AI-driven business ecosystems by delivering scalable, secure, and performance-oriented software solutions.
              </p>
              <p className="text-neutral-600 text-xs font-mono">
                // Redefining how digital spaces operate.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative border border-white/10 p-8 rounded-xl bg-white/[0.02] backdrop-blur-sm h-full">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-red-500" />
                <h3 className="text-xl font-semibold text-white">Our Mission</h3>
              </div>
              <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                To empower cafe owners with smart technology that reduces complexity, increases operational control, and drives sustainable growth through innovation.
              </p>
              <p className="text-neutral-600 text-xs font-mono">
                // Driving sustainable growth via AI.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Why ManagerXP */}
        <div className="relative border border-white/10 rounded-xl p-8 bg-white/[0.02] backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 opacity-[0.02] bg-[length:20px_20px] [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)]" />
          
          <div className="relative z-10">
            <h3 className="text-xl font-semibold text-white mb-8 text-center">
              Why <span className="text-red-500">ManagerXP</span>?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {whyUsPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-neutral-400 group hover:text-white transition-colors">
                  <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
              <p className="text-neutral-500 text-sm font-mono">
                ManagerXP is not just a software provider. <br/>
                We are a <span className="text-white">technology partner</span> committed to building the future of smart cafe ecosystems.
              </p>
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

export default AboutPage;