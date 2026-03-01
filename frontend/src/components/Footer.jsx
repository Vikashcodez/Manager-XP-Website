import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { Zap, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-white text-black overflow-hidden border-t border-gray-200">
      
      {/* --- Background Layers --- */}
      
      {/* 1. PCB Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-5
                   bg-[length:40px_40px]
                   [background-image:linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),
                                      linear-gradient(to_top,rgba(0,0,0,0.1)_1px,transparent_1px)]
                   [mask-image:radial-gradient(ellipse_80%_80%_at_50%_100%,black_40%,transparent_100%)]"
      />

      {/* 2. Racer Light Streaks - Hidden for white bg */}
      <div className="absolute top-0 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent absolute animate-racer-fast opacity-0 blur-[1px]"/>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-purple-400/0 to-transparent absolute animate-racer-slow opacity-0 blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="space-y-6 md:col-span-1">
            <div className="flex items-center">
              <img 
                src={logo}
                alt="Company Logo" 
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-gray-600 text-sm leading-relaxed font-mono">
              Empowering businesses with innovative management solutions for the modern workplace.
            </p>
            <div className="flex space-x-3">
              {/* Social Icons - HUD Style */}
              {['facebook', 'twitter', 'github', 'dribbble'].map((social, i) => (
                <a key={i} href="#" className="p-2 bg-gray-100 border border-gray-300 rounded-full text-gray-600 hover:text-cyan-600 hover:border-cyan-500 transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    {/* Generic icon path for demo */}
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-cyan-600 mb-6 flex items-center gap-2">
              <span className="w-2 h-[1px] bg-cyan-600"></span>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {['Home', 'Our Products', 'About Us', 'Contact Us'].map((item, i) => (
                <li key={i}>
                  <Link to="/" className="group flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    <span className="w-0 h-[1px] bg-cyan-600 group-hover:w-3 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-purple-600 mb-6 flex items-center gap-2">
              <span className="w-2 h-[1px] bg-purple-600"></span>
              Products
            </h4>
            <ul className="space-y-3">
              {['Task Management', 'Team Collaboration', 'Analytics', 'Integrations'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="group flex items-center gap-2 text-gray-600 hover:text-black transition-colors duration-300 text-sm">
                    <Zap className="w-3 h-3 text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-green-600 mb-6 flex items-center gap-2">
              <span className="w-2 h-[1px] bg-green-600"></span>
              Get In Touch
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-gray-600 hover:text-gray-800 transition-colors">
                <Mail className="w-4 h-4 mt-0.5 text-gray-500" />
                <span>info@managerxp.com</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600 hover:text-gray-800 transition-colors">
                <Phone className="w-4 h-4 mt-0.5 text-gray-500" />
                <span>+91 9679549136</span>
              </li>
              <li className="flex items-start gap-3 text-gray-600 hover:text-gray-800 transition-colors">
                <MapPin className="w-4 h-4 mt-0.5 text-gray-500" />
                <span>8-2-644/1/205 F205,<br /> Hiline Complex, Road No.12,<br /> Banjara Hills, Hyderabad- 500034.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-500 text-xs font-mono tracking-wider">
              &copy; {new Date().getFullYear()} ManagerXP. SYSTEM_ONLINE.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-cyan-600 text-xs font-mono transition-colors duration-300 uppercase tracking-wide">
                Privacy_Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-600 text-xs font-mono transition-colors duration-300 uppercase tracking-wide">
                Terms_of_Service
              </a>
              <a href="#" className="text-gray-500 hover:text-cyan-600 text-xs font-mono transition-colors duration-300 uppercase tracking-wide">
                Cookie_Protocol
              </a>
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
    </footer>
  );
};

export default Footer;