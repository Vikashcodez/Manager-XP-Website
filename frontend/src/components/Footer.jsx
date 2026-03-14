import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'; 
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaXTwitter, FaLinkedin } from 'react-icons/fa6';

const Footer = () => {
  // Helper function to determine if logo needs filter (optional, assuming logo is dark, we invert it)
  // If your logo is already white, remove the style prop from the img tag.
  const logoStyle = {
    filter: 'brightness(0) invert(1)', // Inverts black logo to white
  };

  return (
    <footer className="relative bg-black text-white overflow-hidden border-t border-white/10">
      
      {/* --- Background Layers --- */}
      
      {/* 1. Tech Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03]
                   bg-[length:40px_40px]
                   [background-image:linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),
                                      linear-gradient(to_top,rgba(255,255,255,0.1)_1px,transparent_1px)]"
      />

      {/* 2. Ambient Red Glow - Top Center */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-64 z-0
                   bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.15),transparent_70%)]"
      />

      {/* 3. Racer Light Streaks */}
      <div className="absolute top-0 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-red-600/40 to-transparent absolute animate-racer-fast blur-[1px]"/>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-[1px] z-[2] overflow-hidden">
        <div className="w-1/4 h-full bg-gradient-to-r from-transparent via-red-500/20 to-transparent absolute animate-racer-slow blur-[1px]"/>
      </div>

      {/* --- Main Content --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          
          {/* Company Info */}
          <div className="space-y-6 md:col-span-1">
            <div className="flex items-center">
              <img 
                src={logo}
                alt="Company Logo" 
                className="h-8 w-auto object-contain"
                style={logoStyle} // Remove this prop if your logo is already white
              />
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed font-light">
              Empowering businesses with innovative management solutions for the modern workplace.
            </p>
            <div className="flex space-x-3">
              {/* Social Icons - Glass Effect */}
              <a href="https://twitter.com/managerxp" target="_blank" rel="noopener noreferrer" 
                 className="p-2.5 rounded-full border border-white/10 bg-white/5 text-neutral-400 
                            hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 
                            transition-all duration-300 backdrop-blur-sm">
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com/company/managerxp" target="_blank" rel="noopener noreferrer" 
                 className="p-2.5 rounded-full border border-white/10 bg-white/5 text-neutral-400 
                            hover:bg-red-500/10 hover:border-red-500/50 hover:text-red-500 
                            transition-all duration-300 backdrop-blur-sm">
                <FaLinkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-red-500 mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-gradient-to-r from-red-500 to-transparent"></span>
              Navigation
            </h4>
            <ul className="space-y-4">
              {['Home', 'Our Products', 'About Us', 'Contact Us'].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    to={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '')}`} 
                    className="group flex items-center gap-2 text-neutral-300 hover:text-white transition-colors duration-300 text-sm"
                  >
                    <span className="w-0 h-[1px] bg-red-500 group-hover:w-3 transition-all duration-300"></span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-[0.2em] text-red-500 mb-8 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-gradient-to-r from-red-500 to-transparent"></span>
              System Support
            </h4>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-4 text-neutral-300 hover:text-white transition-colors group">
                <Mail className="w-4 h-4 mt-0.5 text-red-500/70 group-hover:text-red-500 transition-colors" />
                <span>info@managerxp.com</span>
              </li>
              <li className="flex items-start gap-4 text-neutral-300 hover:text-white transition-colors group">
                <Phone className="w-4 h-4 mt-0.5 text-red-500/70 group-hover:text-red-500 transition-colors" />
                <span>+91 9679549136</span>
              </li>
              <li className="flex items-start gap-4 text-neutral-300 hover:text-white transition-colors group">
                <MapPin className="w-4 h-4 mt-0.5 text-red-500/70 group-hover:text-red-500 transition-colors flex-shrink-0" />
                <span>8-2-644/1/205 F205, Hiline Complex, Road No.12, Banjara Hills, Hyderabad- 500034.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-neutral-600 text-xs font-mono tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
              &copy; {new Date().getFullYear()} ManagerXP. SYSTEM_ONLINE.
            </p>
            <div className="flex space-x-8">
              <a href="#" className="text-neutral-600 hover:text-red-500 text-xs font-mono transition-colors duration-300 uppercase tracking-wide">
                Privacy_Policy
              </a>
              <a href="#" className="text-neutral-600 hover:text-red-500 text-xs font-mono transition-colors duration-300 uppercase tracking-wide">
                Terms_of_Service
              </a>
              <a href="#" className="text-neutral-600 hover:text-red-500 text-xs font-mono transition-colors duration-300 uppercase tracking-wide">
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
          animation: racer-fast 8s linear infinite;
        }

        @keyframes racer-slow {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100vw); }
        }
        .animate-racer-slow {
          animation: racer-slow 12s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;