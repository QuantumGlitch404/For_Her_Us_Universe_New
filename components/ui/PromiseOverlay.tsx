import React, { useEffect, useState } from 'react';
import { useLove } from '../../store';
import { ViewState } from '../../types';
import { HeartHandshake, XCircle } from 'lucide-react';

export const PromiseOverlay: React.FC = () => {
  const { view, setView } = useLove();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (view === ViewState.PromiseEntrance) {
      setActive(true);
    } else {
      setTimeout(() => setActive(false), 500);
    }
  }, [view]);

  if (!active && view !== ViewState.PromiseEntrance) return null;

  const handleEnter = () => {
      setView(ViewState.PromiseList);
  };

  const handleReject = () => {
      setView(ViewState.Orbit);
  };

  return (
    <div className={`fixed inset-0 z-[50] transition-opacity duration-1000 ${view === ViewState.PromiseEntrance ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      
      {/* 
          NOTE: The Background is handled by the 3D Scene (Plane behind ring).
          This Overlay is purely for the UI Buttons now, allowing the realistic 3D Ring to shine.
      */}

      {/* Button Container - Positioned below the ring (Ring is at Y=0.5 in 3D, approx center-top screen) */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-[20vh] md:pb-[15vh]">
          
          <div className="flex flex-col items-center gap-6 animate-float">
                {/* Title */}
                <h2 className="text-pink-100 font-serif-elegant text-5xl md:text-7xl drop-shadow-[0_0_25px_rgba(226,192,184,0.6)] mb-4">
                    Our Promise
                </h2>
                
                {/* Buttons */}
                <div className="flex flex-col gap-4 items-center">
                    <button 
                    onClick={handleEnter}
                    className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-pink-500/20 to-rose-500/20 hover:from-pink-500/40 hover:to-rose-500/40 border border-pink-200/30 rounded-full text-pink-50 transition-all hover:scale-105 group backdrop-blur-sm"
                    >
                        <HeartHandshake className="group-hover:text-white transition-colors w-5 h-5" />
                        <span className="font-serif-elegant tracking-widest text-lg">To My Wife</span>
                    </button>

                    <button 
                    onClick={handleReject}
                    className="flex items-center gap-2 px-6 py-2 bg-transparent hover:bg-white/5 border border-transparent hover:border-white/10 rounded-full text-white/30 hover:text-white/60 transition-all text-xs"
                    >
                        <span>You don't love me</span>
                        <XCircle size={12} />
                    </button>
                </div>
          </div>
      </div>
    </div>
  );
};