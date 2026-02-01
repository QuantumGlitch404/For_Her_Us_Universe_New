import React, { useEffect, useState } from 'react';
import { useLove } from '../../store';
import { ViewState } from '../../types';
import { Sparkles, XCircle, ArrowRightCircle } from 'lucide-react';

export const PortalOverlay: React.FC = () => {
  const { view, setView } = useLove();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (view === ViewState.PortalEntrance) {
      setActive(true);
    } else {
      setTimeout(() => setActive(false), 500);
    }
  }, [view]);

  if (!active && view !== ViewState.PortalEntrance) return null;

  const handleEnter = () => {
      // Go to Dream Date
      setView(ViewState.DreamDate);
  };

  const handleReject = () => {
      // Go back
      setView(ViewState.Orbit);
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-black transition-opacity duration-1000 ${view === ViewState.PortalEntrance ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#2a1005_0%,#000000_70%)] opacity-80" />

      {/* THE PORTAL CONTAINER */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        
        {/* Spinning Sparks Ring (Layer 1) */}
        <div className="w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] rounded-full border-[4px] border-orange-500/30 animate-[spin_10s_linear_infinite] shadow-[0_0_100px_rgba(234,88,12,0.5)]"></div>
        
        {/* Fiery Ring (Layer 2) - CSS Trick for uneven ring */}
        <div className="absolute w-[75vw] h-[75vw] md:w-[550px] md:h-[550px] rounded-full border-[8px] border-transparent border-t-orange-400 border-l-orange-500 border-r-orange-600 blur-[2px] animate-[spin_3s_linear_infinite]"></div>
        
        {/* Sparks Particles (Layer 3) */}
        <div className="absolute w-[70vw] h-[70vw] md:w-[500px] md:h-[500px] rounded-full border-[2px] border-dashed border-yellow-200/50 animate-[spin_8s_linear_infinite_reverse]"></div>

        {/* Central Void */}
        <div className="absolute w-[65vw] h-[65vw] md:w-[450px] md:h-[450px] bg-black rounded-full shadow-[inset_0_0_60px_#ea580c] flex items-center justify-center">
            
            {/* Content Inside Portal */}
            <div className="relative z-10 text-center flex flex-col gap-6 animate-float">
                <h2 className="text-orange-100 font-serif-elegant text-4xl md:text-5xl drop-shadow-[0_0_15px_rgba(251,146,60,0.8)]">
                    The Dream World
                </h2>
                <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full shadow-[0_0_10px_orange]"></div>
                
                <div className="flex flex-col gap-4 mt-4">
                    <button 
                        onClick={handleEnter}
                        className="group flex items-center justify-center gap-3 px-8 py-3 bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/50 rounded-full text-orange-100 transition-all hover:scale-105"
                    >
                        <span className="font-soft uppercase tracking-widest text-sm">Enter The Portal</span>
                        <ArrowRightCircle className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button 
                        onClick={handleReject}
                        className="group flex items-center justify-center gap-3 px-8 py-3 bg-transparent hover:bg-white/5 border border-white/10 rounded-full text-white/50 hover:text-white/80 transition-all text-xs"
                    >
                         <span>You don't love me</span>
                         <XCircle size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>

        </div>

      </div>
      
      {/* Falling Sparks Effect (CSS) */}
      <style>{`
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
