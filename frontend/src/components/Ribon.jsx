import React from 'react';
import { Zap, Calendar, ArrowRight } from 'lucide-react';

const DemoRibbon = () => {
  return (
    <div className="relative w-full py-12 overflow-hidden">
      
      {/* Background Slanted Ribbon Shape */}
      <div className="absolute inset-0 z-0">
        {/* The main dark background with skew */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-100 to-gray-50 
                     border-y border-gray-300
                     transform -skew-y-1 scale-110" 
        />
        
        {/* Glowing Racing Lines */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-600/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-purple-600/50 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
        
        {/* Text Section */}
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="p-3 rounded-lg bg-gray-100 border border-gray-300 backdrop-blur-sm">
            <Zap className="w-6 h-6 text-cyan-600 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-black tracking-tight">
              BOOK YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-purple-600">DEMO</span> NOW
            </h3>
            <p className="text-xs text-gray-600 font-mono uppercase tracking-wider mt-0.5">
              Experience the ecosystem firsthand
            </p>
          </div>
        </div>

        {/* Vertical Divider (Visible on Desktop) */}
        <div className="hidden md:block h-10 w-[1px] bg-gray-300" />

        {/* Button Section */}
        <div className="flex items-center gap-4">
          <button 
            className="group flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold rounded-full 
                       transition-all duration-300 hover:bg-gray-800 active:scale-95 
                       shadow-[0_0_25px_-5px_rgba(0,0,0,0.3)]
                       relative overflow-hidden"
          >
            {/* Shine Animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-gray-600/50 to-transparent skew-x-12" />
            
            <Calendar className="w-4 h-4 relative z-10" />
            <span className="relative z-10">BOOK DEMO</span>
          </button>

          {/* Secondary Ghost Button (Optional) */}
          <button className="group hidden sm:flex items-center gap-2 px-4 py-3 text-gray-700 text-xs font-mono transition-colors hover:text-black">
            LEARN MORE
            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoRibbon;