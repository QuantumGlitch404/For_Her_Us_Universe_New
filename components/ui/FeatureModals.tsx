import React from 'react';
import { useLove } from '../../store';
import { ViewState } from '../../types';
import { X, Heart, Lock, Check, Sparkles } from 'lucide-react';

export const FeatureModals: React.FC = () => {
  const { 
    view, setView,
    activeReason, closeReason,
    promises,
    dreamDestinations, activeDreamDate, setDreamDate,
    flirtyNotes,
    activeBottle, closeBottle
  } = useLove();

  // Helper for Dream Card Gradients
  const getDreamGradient = (id: string) => {
    switch (id) {
      case 'beach': return 'bg-gradient-to-br from-orange-300/20 via-rose-300/10 to-blue-900/40 border-orange-200/30 hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]';
      case 'rooftop': return 'bg-gradient-to-br from-indigo-900/40 via-purple-900/40 to-black/60 border-purple-300/30 hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]';
      case 'stars': return 'bg-gradient-to-br from-blue-900/40 via-slate-800/40 to-black/60 border-blue-300/30 hover:shadow-[0_0_30px_rgba(96,165,250,0.3)]';
      case 'cherry': return 'bg-gradient-to-br from-pink-300/20 via-rose-200/10 to-pink-900/40 border-pink-200/30 hover:shadow-[0_0_30px_rgba(244,114,182,0.3)]';
      default: return 'bg-white/10';
    }
  };

  return (
    <>
      {/* 1. LOVE REASON MODAL (Floating Text from Jar) */}
      {activeReason && (
        <div className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center">
           <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl animate-float shadow-2xl max-w-sm text-center transform translate-y-[-100px]">
              <div className="text-xs uppercase tracking-widest text-pink-300 mb-2">{activeReason.category}</div>
              <div className="font-serif-elegant text-2xl text-white drop-shadow-lg">
                "{activeReason.text}"
              </div>
           </div>
        </div>
      )}

      {/* 2. PROMISE RING MODAL */}
      {view === ViewState.PromiseList && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#fff1f2] w-full max-w-md max-h-[80vh] overflow-y-auto rounded-xl p-8 shadow-2xl relative border-4 border-double border-pink-200">
            <button onClick={() => setView(ViewState.Orbit)} className="absolute top-4 right-4 text-pink-900/50 hover:text-pink-900"><X /></button>
            
            <h2 className="font-serif-elegant text-3xl text-center text-pink-900 mb-2">My Promises</h2>
            <p className="text-center font-soft text-pink-700/70 text-sm mb-6">Sworn to you, forever.</p>
            
            <div className="space-y-6">
              {promises.map((p, i) => (
                <div key={p.id} className="relative pl-6 border-l-2 border-pink-200">
                  <span className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-pink-100 border border-pink-300 flex items-center justify-center">
                    <span className="text-[8px] text-pink-500 font-bold">{i+1}</span>
                  </span>
                  <p className="font-hand text-xl text-gray-800 leading-snug">{p.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. DREAM DATE MENU (REDESIGNED) */}
      {view === ViewState.DreamDate && !activeDreamDate && (
        <div className="fixed inset-0 z-[70] bg-[#0f0518]/90 backdrop-blur-xl overflow-y-auto">
           {/* Background decorative blobs - Fixed so they don't scroll */}
           <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
           <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{animationDelay: '1s'}}></div>

           <div className="min-h-full flex items-center justify-center p-6">
             <div className="w-full max-w-5xl relative z-10">
                <div className="flex justify-between items-start mb-8 md:mb-10">
                   <div>
                      <h2 className="text-pink-100 font-serif-elegant text-4xl md:text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                         Where shall we escape?
                      </h2>
                      <p className="text-pink-200/60 font-hand text-xl md:text-2xl mt-2 ml-1">
                         Pick a dream, my love...
                      </p>
                   </div>
                   <button 
                     onClick={() => setView(ViewState.Orbit)} 
                     className="group p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 shrink-0"
                   >
                     <X size={24} className="text-white/50 group-hover:text-white transition-colors" />
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-6">
                   {dreamDestinations.map(dest => (
                      <button 
                        key={dest.id} 
                        onClick={() => setDreamDate(dest)}
                        className={`
                          group relative h-48 md:h-56 w-full rounded-3xl overflow-hidden border transition-all duration-500 hover:scale-[1.02]
                          flex flex-col justify-end text-left p-6 md:p-8
                          ${getDreamGradient(dest.id)}
                        `}
                      >
                         {/* Background Emoji (Giant & Faded) */}
                         <div className="absolute -right-2 -top-6 text-[8rem] md:text-[10rem] opacity-[0.08] group-hover:opacity-[0.15] group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 select-none grayscale group-hover:grayscale-0">
                           {dest.emoji}
                         </div>
                         
                         {/* Sparkles Decoration */}
                         <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 text-white/80">
                            <Sparkles size={20} className="animate-spin-slow" />
                         </div>

                         {/* Text Content */}
                         <div className="relative z-10">
                            <h3 className="text-white font-serif-elegant text-2xl md:text-4xl mb-1 group-hover:text-pink-200 transition-colors drop-shadow-md">
                              {dest.title}
                            </h3>
                            <div className="h-0.5 w-8 md:w-12 bg-white/30 mb-2 md:mb-3 group-hover:w-16 md:group-hover:w-24 transition-all duration-500"></div>
                            <p className="text-white/80 font-hand text-lg md:text-2xl tracking-wide group-hover:text-white transition-colors">
                              {dest.description}
                            </p>
                         </div>
                      </button>
                   ))}
                </div>
             </div>
           </div>
        </div>
      )}

      {/* 3b. ACTIVE DREAM DATE VIEW (REDESIGNED) */}
      {view === ViewState.DreamDate && activeDreamDate && (
         <div 
           className="fixed inset-0 z-[80] overflow-y-auto text-center transition-all duration-1000"
           style={{ backgroundColor: activeDreamDate.color }}
         >
            {/* Vignette & Texture Overlay */}
            <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm pointer-events-none" />

            <div className="relative z-10 min-h-full flex items-center justify-center p-4 md:p-6">
               
               <div className="max-w-2xl w-full my-auto">
                   {/* Main Card */}
                   <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] shadow-[0_0_60px_rgba(0,0,0,0.3)] animate-float">
                       <div className="text-6xl md:text-8xl mb-4 animate-bounce drop-shadow-2xl filter saturate-150">{activeDreamDate.emoji}</div>
                       
                       <h2 className="text-white font-serif-elegant text-3xl md:text-5xl lg:text-6xl mb-4 md:mb-6 drop-shadow-lg tracking-wide leading-tight">
                         {activeDreamDate.title}
                       </h2>
                       
                       <div className="w-full h-px bg-gradient-to-r from-transparent via-white/40 to-transparent mb-6 md:mb-8"></div>

                       <p className="text-white/95 font-hand text-xl md:text-3xl lg:text-4xl leading-relaxed mb-8 md:mb-10 drop-shadow-md italic">
                          "{activeDreamDate.loveNote}"
                       </p>
                       
                       <button 
                          onClick={() => setDreamDate(null)} 
                          className="group relative px-6 py-3 md:px-8 md:py-3 bg-white/10 hover:bg-white/20 rounded-full border border-white/30 transition-all hover:scale-105 active:scale-95"
                       >
                          <span className="font-serif-elegant text-white text-base md:text-lg tracking-widest uppercase flex items-center justify-center gap-2">
                            Back to Our Universe <Heart size={16} className="fill-white" />
                          </span>
                          <div className="absolute inset-0 rounded-full blur-md bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                       </button>
                   </div>
               </div>

            </div>
         </div>
      )}

      {/* 4. SECRET DRAWER */}
      {view === ViewState.SecretDrawer && (
         <div className="fixed inset-0 z-[70] bg-[#1a0505]/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-[#2a0a0a] border border-red-900/50 p-8 rounded-lg max-w-lg w-full relative shadow-[0_0_50px_rgba(100,0,0,0.5)]">
               <button onClick={() => setView(ViewState.Orbit)} className="absolute top-4 right-4 text-red-500/50 hover:text-red-400"><X /></button>
               <h2 className="text-red-200 font-serif-elegant text-3xl mb-6 text-center flex items-center justify-center gap-2">
                  <Lock size={20} /> Secret Notes
               </h2>
               
               <div className="grid gap-3">
                  {flirtyNotes.map(note => (
                     <div key={note.id} className="bg-black/40 p-4 rounded border border-red-900/30 group hover:border-red-500/50 transition-colors cursor-pointer">
                        <p className="text-red-100/80 font-hand text-lg">{note.text}</p>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}

      {/* 5. MESSAGE BOTTLE */}
      {activeBottle && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-auto bg-black/40 backdrop-blur-sm">
            <div className="bg-[#fef3c7] text-gray-800 p-8 max-w-md w-full rounded-sm shadow-2xl relative rotate-1 animate-float">
               <button onClick={closeBottle} className="absolute top-2 right-2 opacity-50 hover:opacity-100"><X size={20} /></button>
               <div className="border-b border-gray-300 pb-4 mb-4 text-center">
                  <span className="font-serif-elegant text-2xl text-blue-900">Message from the Sea</span>
               </div>
               <p className="font-hand text-2xl leading-relaxed text-center mb-6">
                  {activeBottle.text}
               </p>
               <div className="text-right font-serif-elegant text-sm opacity-60">- Dani 💙</div>
            </div>
         </div>
      )}
    </>
  );
};