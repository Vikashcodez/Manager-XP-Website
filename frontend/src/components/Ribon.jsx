import React, { useState, useEffect } from 'react';
import { Zap, Rocket, ArrowRight, Monitor } from 'lucide-react';

const FreeTrialRibbon = () => {
  const [trialData, setTrialData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrialData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/subscription-plans/gamingxp-free-trial');
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          setTrialData(result.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch trial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrialData();
  }, []);

  // Extract dynamic values with fallbacks
  const days = trialData?.no_of_days || 15;
  const maxPcs = trialData?.max_pcs || 5;
  const softwareName = trialData?.subs_software?.toUpperCase() || 'GAMINGXP';

  return (
    <div className="relative w-full py-16 overflow-hidden bg-black">
      
      {/* Background Slanted Ribbon Shape */}
      <div className="absolute inset-0 z-0">
        {/* The main dark background with skew */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-black to-neutral-950 
                     border-y border-white/10
                     transform -skew-y-1 scale-110" 
        />
        
        {/* Ambient Red Glow */}
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(220,38,38,0.15),transparent)]" />

        {/* Glowing Racing Lines */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/40 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        
        {/* Text Section */}
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="p-3.5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <Zap className="w-6 h-6 text-red-500 animate-pulse" />
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              START YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">{days}-DAY</span> TRIAL
            </h3>
            <p className="text-xs text-neutral-400 font-mono uppercase tracking-wider mt-1">
              Access {softwareName} on up to {maxPcs} PCs — No credit card required
            </p>
          </div>
        </div>

        {/* Vertical Divider (Visible on Desktop) */}
        <div className="hidden md:block h-12 w-[1px] bg-gradient-to-b from-transparent via-neutral-700 to-transparent" />

        {/* Button Section */}
        <div className="flex items-center gap-6">
          <button 
            className="group relative flex items-center gap-3 px-8 py-3.5 
                       text-sm font-semibold rounded-full text-white 
                       transition-all duration-300 
                       bg-red-600/10 border border-red-500/30
                       hover:bg-red-600/20 hover:border-red-500/60
                       active:scale-95 
                       shadow-[0_0_25px_-10px_rgba(220,38,38,0.4)]
                       backdrop-blur-md"
          >
            {/* Shine Animation */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 rounded-full" />
            
            <Rocket className="w-4 h-4 relative z-10 text-red-400 group-hover:text-white transition-colors" />
            <span className="relative z-10">START FREE TRIAL</span>
          </button>

          {/* Secondary Ghost Button */}
          <button className="group hidden sm:flex items-center gap-2 px-4 py-3 text-neutral-500 text-xs font-mono transition-colors hover:text-white border border-transparent hover:border-white/10 rounded-full">
            VIEW PLANS
            <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeTrialRibbon;