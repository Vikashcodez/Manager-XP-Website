import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Mail, Phone, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import emailjs from '@emailjs/browser';

const ContactPage = () => {
  const canvasRef = useRef(null);
  const formRef = useRef(null);
  
  // Form State
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      <div className="absolute top-1/3 left-0 w-full h-[2px] z-[2] overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent absolute animate-racer-fast opacity-80 blur-[1px]"/>
      </div>
      <div className="absolute bottom-1/4 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-purple-500 to-transparent absolute animate-racer-slow opacity-60 blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-4">
            <div className="flex items-center gap-4 text-xs text-gray-600 font-mono tracking-[0.2em] uppercase">
              <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-gray-300" />
              <span className="text-cyan-600">Communication Channel</span>
              <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-gray-300" />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter text-black mb-4">
            CONTACT <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">US</span>
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto text-lg font-light">
            Have a project in mind or need support? Initialize a connection.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Card */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 backdrop-blur-sm hover:border-cyan-600/30 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-cyan-100 rounded-lg text-cyan-600 group-hover:bg-cyan-200 transition-colors">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-black font-bold mb-1">Location</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    8-2-644/1/205 F205, Hiline Complex, <br />
                    Road No.12, Banjara Hills,<br />
                     Hyderabad- 500034
                  </p>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 backdrop-blur-sm hover:border-purple-600/30 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-lg text-purple-600 group-hover:bg-purple-200 transition-colors">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-black font-bold mb-1">Email</h3>
                  <p className="text-gray-700 text-sm">
                    support@managerxp.com
                  </p>
                  <p className="text-gray-600 text-xs mt-1 font-mono">Response time: ~24h</p>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-6 backdrop-blur-sm hover:border-green-600/30 transition-all group">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-100 rounded-lg text-green-600 group-hover:bg-green-200 transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-black font-bold mb-1">Phone</h3>
                  <p className="text-gray-700 text-sm">
                    +91 9679549136
                  </p>
                  <p className="text-gray-600 text-xs mt-1 font-mono">Mon-Fri: 9AM - 6PM</p>
                </div>
              </div>
            </div>

            {/* Decorative Terminal Element */}
            <div className="hidden lg:block bg-gray-50 border border-gray-300 rounded-lg p-1 font-mono text-xs shadow-xl">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-300">
                 <div className="w-2 h-2 rounded-full bg-red-500/80" />
                 <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                 <div className="w-2 h-2 rounded-full bg-green-500/80" />
              </div>
              <div className="p-3 text-gray-700">
                <span className="text-cyan-600">$</span> ping support.managerxp.com <br/>
                <span className="text-green-600">status:</span> online <br/>
                <span className="text-green-600">latency:</span> 12ms
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3 bg-gray-50 border border-gray-300 rounded-lg p-1 backdrop-blur-md font-mono text-xs shadow-2xl relative overflow-hidden">
            
            {/* Window Controls */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 bg-gray-50">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 border border-yellow-400/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80 border border-green-400/50" />
              </div>
              <span className="text-gray-600 text-xs">new_message.config</span>
              <div className="text-gray-700 text-xs">SECURE</div>
            </div>

            <form ref={formRef} onSubmit={sendEmail} className="p-6 md:p-8 space-y-6 relative z-10">
              
              {/* Status Notification */}
              {status.message && (
                <div className={`flex items-center gap-2 p-3 rounded text-sm font-mono ${status.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                  {status.message}
                </div>
              )}

              {/* Grid for Name & Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 text-xs uppercase tracking-wider">User Name</label>
                  <input 
                    type="text" 
                    name="user_name" 
                    required
                    className="w-full bg-gray-50 border border-gray-300 text-black px-4 py-3 rounded focus:outline-none focus:border-cyan-600 transition-colors placeholder-gray-500 text-sm"
                    placeholder="Enter name..."
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 text-xs uppercase tracking-wider">User Email</label>
                  <input 
                    type="email" 
                    name="user_email" 
                    required
                    className="w-full bg-gray-50 border border-gray-300 text-black px-4 py-3 rounded focus:outline-none focus:border-cyan-600 transition-colors placeholder-gray-500 text-sm"
                    placeholder="Enter email..."
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-gray-700 mb-2 text-xs uppercase tracking-wider">Subject</label>
                <input 
                  type="text" 
                  name="subject" 
                  required
                  className="w-full bg-gray-50 border border-gray-300 text-black px-4 py-3 rounded focus:outline-none focus:border-cyan-600 transition-colors placeholder-gray-500 text-sm"
                  placeholder="Topic of transmission..."
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 mb-2 text-xs uppercase tracking-wider">Message</label>
                <textarea 
                  name="message" 
                  rows="5" 
                  required
                  className="w-full bg-gray-50 border border-gray-300 text-black px-4 py-3 rounded focus:outline-none focus:border-cyan-600 transition-colors placeholder-gray-500 text-sm resize-none"
                  placeholder="Type your message here..."
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="group flex items-center justify-center gap-2 w-full px-6 py-3 bg-black text-white font-bold rounded-full 
                           transition-all duration-300 hover:bg-gray-800 active:scale-95 
                           shadow-[0_0_30px_-5px_rgba(0,0,0,0.2)]
                           disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                >
                  {/* Shine Effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-gray-600/40 to-transparent skew-x-12" />
                  
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      TRANSMITTING...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      SEND MESSAGE
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

export default ContactPage;