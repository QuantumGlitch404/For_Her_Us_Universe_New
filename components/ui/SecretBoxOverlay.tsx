import React, { useEffect, useState } from 'react';
import { useLove } from '../../store';
import { ViewState } from '../../types';
import { Lock, XCircle, KeyRound } from 'lucide-react';

export const SecretBoxOverlay: React.FC = () => {
  const { view, setView } = useLove();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (view === ViewState.SecretBoxEntrance) {
      setActive(true);
    } else {
      setTimeout(() => setActive(false), 500);
    }
  }, [view]);

  if (!active && view !== ViewState.SecretBoxEntrance) return null;

  const handleEnter = () => {
      // Transition to actual drawer content
      setView(ViewState.SecretDrawer);
  };

  const handleReject = () => {
      // Go back
      setView(ViewState.Orbit);
  };

  return (
    <div className={`fixed inset-0 z-[50] transition-opacity duration-1000 ${view === ViewState.SecretBoxEntrance ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Button Container - Positioned below the chest */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-[20vh] md:pb-[15vh]">
          
          <div className="flex flex-col items-center gap-6 animate-float">
                {/* Title */}
                <h2 className="text-pink-100 font-serif-elegant text-5xl md:text-7xl drop-shadow-[0_0_25px_rgba(255,100,100,0.6)] mb-4">
                    The Secret Box
                </h2>
                
                {/* Buttons */}
                <div className="flex flex-col gap-4 items-center">
                    <button 
                    onClick={handleEnter}
                    className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-red-800/40 to-pink-800/40 hover:from-red-600/60 hover:to-pink-600/60 border border-pink-200/30 rounded-full text-pink-50 transition-all hover:scale-105 group backdrop-blur-sm"
                    >
                        <KeyRound className="group-hover:rotate-45 transition-transform w-5 h-5 text-yellow-300" />
                        <span className="font-serif-elegant tracking-widest text-lg">Open the Box</span>
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