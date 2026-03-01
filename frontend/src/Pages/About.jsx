import React, { useEffect, useRef } from 'react';
import { 
  Gamepad2, Monitor, Brain, Target, Eye, Zap, 
  Shield, Cpu, BarChart3, Users, Clock, CheckCircle 
} from 'lucide-react';

const AboutPage = () => {
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
    <div className="relative min-h-screen bg-white overflow-hidden antialiased font-sans">
      
      {/* --- Background Layers --- */}
      <div 
        className="absolute inset-0 z-0 opacity-20
                   bg-[length:40px_40px]
                   [background-image:linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),
                                      linear-gradient(to_top,rgba(0,0,0,0.05)_1px,transparent_1px)]
                   [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black_40%,transparent_100%)]"
      />
      <canvas ref={canvasRef} className="absolute inset-0 z-[1] opacity-0" />
      <div className="absolute bottom-0 left-0 right-0 h-[40%] z-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent" />

      {/* Racer Light Streaks */}
      <div className="absolute top-1/4 left-0 w-full h-[2px] z-[2] overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent absolute animate-racer-fast opacity-80 blur-[1px]"/>
      </div>
      <div className="absolute bottom-1/3 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent absolute animate-racer-slow opacity-60 blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        
        {/* Header Section */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-xs text-gray-600 font-mono tracking-[0.2em] uppercase">
              <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-gray-300" />
              <span className="text-cyan-600">System Identity</span>
              <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-gray-300" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-black mb-6">
            ABOUT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">MANAGERXP</span>
          </h1>
          
          <p className="text-gray-700 max-w-3xl mx-auto text-lg font-light">
            A next-generation cafe software and AI solutions provider dedicated to transforming how digital spaces operate.
          </p>
        </div>

        {/* Section 1: Who We Are & Our Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          
          {/* Who We Are */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-8 backdrop-blur-sm relative overflow-hidden group hover:border-cyan-600/30 transition-all duration-500">
            <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-cyan-500/10 rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-3">
              <Users className="w-5 h-5 text-cyan-600" />
              Who We Are
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-4">
              Founded in <span className="text-black">2026</span>, ManagerXP is a next-generation cafe software and AI solutions provider. We specialize in building intelligent management platforms that combine automation, real-time monitoring, billing systems, and AI-driven analytics.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              From high-performance gaming arenas to traditional cyber cafes, our solutions are designed to simplify operations, improve efficiency, and maximize profitability.
            </p>
          </div>

          {/* Our Story - Terminal Style */}
          <div className="bg-gray-50 border border-gray-300 rounded-lg p-1 font-mono text-xs shadow-xl relative overflow-hidden h-full flex flex-col">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-300 bg-gray-50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="text-gray-600 ml-2 text-[10px]">origin_story.log</span>
            </div>
            <div className="p-5 flex-1 overflow-auto">
              <pre className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                <code>
<span className="text-purple-600">const</span> vision = <span className="text-yellow-600">"Change outdated systems"</span>;{'\n'}
{'\n'}
<span className="text-gray-600">/* Traditional systems were fragmented. */</span>{'\n'}
<span className="text-cyan-600">managerXP</span>.init({'{'}
  integration: [<span className="text-green-600">'Gaming Session Control'</span>],{'\n'}
  monitoring: [<span className="text-green-600">'Real-time System Data'</span>],{'\n'}
  intelligence: [<span className="text-green-600">'AI Business Logic'</span>],{'\n'}
  billing: <span className="text-cyan-600">Automated</span>{'\n'}
{'}'});{'\n'}
{'\n'}
<span className="text-gray-600">// Goal: Smart, scalable, future-ready.</span>
                </code>
              </pre>
            </div>
          </div>
        </div>

        {/* Section 2: What We Do */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-black mb-2">What We Do</h2>
            <p className="text-gray-600 text-sm">We don't just manage cafes — we build intelligent digital ecosystems.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: GamingXP */}
            <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg hover:border-purple-600/50 transition-all group">
              <div className="p-3 bg-purple-100 rounded-lg w-fit mb-4 group-hover:bg-purple-200 transition-colors">
                <Gamepad2 className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Gaming Cafe Software</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                High-performance systems with telemetry data, session control, tournament handling, and smart billing.
              </p>
            </div>

            {/* Card 2: CafeXP */}
            <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg hover:border-cyan-600/50 transition-all group">
              <div className="p-3 bg-cyan-100 rounded-lg w-fit mb-4 group-hover:bg-cyan-200 transition-colors">
                <Monitor className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">Internet Cafe Software</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Secure user access management, automated billing, centralized control, and real-time reporting.
              </p>
            </div>

            {/* Card 3: AI Solutions */}
            <div className="bg-gray-50 border border-gray-300 p-6 rounded-lg hover:border-green-600/50 transition-all group">
              <div className="p-3 bg-green-100 rounded-lg w-fit mb-4 group-hover:bg-green-200 transition-colors">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-black mb-2">AI Solutions</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Predict peak hours, analyze behavior, forecast revenue, detect anomalies, and optimize operations.
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: Vision & Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
          {/* Vision */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-50" />
            <div className="relative border border-gray-300 p-8 rounded-lg bg-gray-50 backdrop-blur-sm h-full">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-cyan-600" />
                <h3 className="text-xl font-bold text-black">Our Vision</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                To become a global leader in cafe management and AI-driven business ecosystems by delivering scalable, secure, and performance-oriented software solutions.
              </p>
              <p className="text-gray-600 text-xs font-mono">
                // Redefining how digital spaces operate.
              </p>
            </div>
          </div>

          {/* Mission */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-50" />
            <div className="relative border border-gray-300 p-8 rounded-lg bg-gray-50 backdrop-blur-sm h-full">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-purple-600" />
                <h3 className="text-xl font-bold text-black">Our Mission</h3>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                To empower cafe owners with smart technology that reduces complexity, increases operational control, and drives sustainable growth through innovation.
              </p>
              <p className="text-gray-600 text-xs font-mono">
                // Driving sustainable growth via AI.
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Why ManagerXP */}
        <div className="relative border border-gray-300 rounded-lg p-8 bg-gray-50 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[length:20px_20px] [background-image:linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)]" />
          
          <div className="relative z-10">
            <h3 className="text-xl font-bold text-black mb-6 text-center">
              Why <span className="text-cyan-600">ManagerXP</span>?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {whyUsPoints.map((point, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-gray-700 group hover:text-black transition-colors">
                  <CheckCircle className="w-4 h-4 text-cyan-600 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  <span>{point}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600 text-sm font-mono">
                ManagerXP is not just a software provider. <br/>
                We are a <span className="text-black">technology partner</span> committed to building the future of smart cafe ecosystems.
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

export default AboutPage;