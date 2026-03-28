import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Mail, Phone, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
  const canvasRef = useRef(null);
  const formRef = useRef(null);
  
  // Form State
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    // REPLACE THESE WITH YOUR ACTUAL EMAILJS IDs
    const serviceID = 'YOUR_SERVICE_ID'; 
    const templateID = 'YOUR_TEMPLATE_ID';
    const publicKey = 'YOUR_PUBLIC_KEY';

    emailjs.sendForm(serviceID, templateID, formRef.current, publicKey)
      .then((result) => {
          console.log(result.text);
          setStatus({ type: 'success', message: 'Message transmitted successfully!' });
          formRef.current.reset();
      }, (error) => {
          console.log(error.text);
          setStatus({ type: 'error', message: 'Transmission failed. Please try again.' });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

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
      <div className="absolute bottom-1/4 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-red-500/40 to-transparent absolute animate-racer-slow blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 lg:px-8 py-8 lg:py-12 flex flex-col min-h-screen">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-xs text-neutral-500 font-mono tracking-[0.2em] uppercase">
              <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-neutral-700" />
              <span className="text-red-500">Communication Channel</span>
              <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-neutral-700" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white mb-4">
            CONTACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">US</span>
          </h1>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg font-light">
            Have a project in mind or need support? Initialize a connection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Card */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:border-red-500/30 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-3 border border-white/10 bg-white/5 rounded-lg text-red-500 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Location</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    8-2-644/1/205 F205, Hiline Complex, <br />
                    Road No.12, Banjara Hills,<br />
                     Hyderabad- 500034
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:border-red-500/30 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-3 border border-white/10 bg-white/5 rounded-lg text-red-400 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Email</h3>
                  <p className="text-neutral-400 text-sm">
                    support@managerxp.com
                  </p>
                  <p className="text-neutral-600 text-xs mt-1 font-mono">Response time: ~24h</p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm hover:border-red-500/30 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-3 border border-white/10 bg-white/5 rounded-lg text-red-500 group-hover:border-red-500/30 group-hover:bg-red-500/10 transition-all">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Phone</h3>
                  <p className="text-neutral-400 text-sm">
                    +91 9679549136
                  </p>
                  <p className="text-neutral-600 text-xs mt-1 font-mono">Mon-Fri: 9AM - 6PM</p>
                </div>
              </div>
            </div>

            {/* Decorative Terminal Element */}
            <div className="hidden lg:block bg-neutral-900 border border-white/10 rounded-xl p-1 font-mono text-xs shadow-xl">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/5 bg-white/[0.02]">
                 <div className="w-2 h-2 rounded-full bg-red-500" />
                 <div className="w-2 h-2 rounded-full bg-yellow-500" />
                 <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
              <div className="p-3 text-neutral-400">
                <span className="text-red-500">$</span> ping support.managerxp.com <br/>
                <span className="text-green-500">status:</span> online <br/>
                <span className="text-green-500">latency:</span> 12ms
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3 bg-white/[0.02] border border-white/10 rounded-xl p-1 backdrop-blur-md font-mono text-xs relative overflow-hidden shadow-[0_0_50px_-20px_rgba(220,38,38,0.1)]">
            
            {/* Window Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
              <span className="text-neutral-600 text-xs">new_message.config</span>
              <div className="text-neutral-500 text-xs">SECURE</div>
            </div>

            <form ref={formRef} onSubmit={sendEmail} className="p-6 md:p-8 space-y-6 relative z-10">
              
              {/* Status Notification */}
              {status.message && (
                <div className={`flex items-center gap-2 p-3 rounded-lg text-sm font-mono ${status.type === 'success' ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                  {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {status.message}
                </div>
              )}

              {/* Grid for Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-neutral-500 mb-2 text-xs uppercase tracking-wider">User Name</label>
                  <input 
                    type="text" 
                    name="user_name" 
                    required
                    className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-colors placeholder-neutral-700 text-sm"
                    placeholder="Enter name..."
                  />
                </div>
                <div>
                  <label className="block text-neutral-500 mb-2 text-xs uppercase tracking-wider">User Email</label>
                  <input 
                    type="email" 
                    name="user_email" 
                    required
                    className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-colors placeholder-neutral-700 text-sm"
                    placeholder="Enter email..."
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-neutral-500 mb-2 text-xs uppercase tracking-wider">Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  required
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-colors placeholder-neutral-700 text-sm"
                  placeholder="Topic of transmission..."
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-neutral-500 mb-2 text-xs uppercase tracking-wider">Message</label>
                <textarea 
                  name="message" 
                  rows="5" 
                  required
                  className="w-full bg-white/[0.03] border border-white/10 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-colors placeholder-neutral-700 text-sm resize-none"
                  placeholder="Type your message here..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="group relative flex items-center justify-center gap-3 w-full px-8 py-3.5 
                           text-sm font-semibold rounded-full text-white 
                           transition-all duration-300 
                           bg-gradient-to-br from-red-700 to-red-900
                           border border-white/10
                           hover:scale-[1.01] active:scale-[0.98]
                           shadow-[0_0_25px_-5px_rgba(220,38,38,0.4)]
                           disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                >
                  {/* Shine Animation */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />
                  
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      TRANSMITTING...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">SEND MESSAGE</span>
                    </>
                  )}
                </button>
              </div>
            </form>
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

export default ContactPage;