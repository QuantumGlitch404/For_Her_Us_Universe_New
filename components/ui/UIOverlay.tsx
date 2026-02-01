import React, { useState, useEffect, useRef } from 'react';
import { useLove } from '../../store';
import { Mood, ViewState } from '../../types';
import { Heart, Moon, Sun, MessageCircleHeart, Star, CalendarHeart, X, Send, Phone, Wind, Gift, Gem, Lock, Users, Plane, Droplets, Sparkles } from 'lucide-react';
import { WhisperOverlay } from './WhisperOverlay';
import { FeatureModals } from './FeatureModals';
import { PortalOverlay } from './PortalOverlay';
import { PromiseOverlay } from './PromiseOverlay';
import { SecretBoxOverlay } from './SecretBoxOverlay';

const Button: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string }> = ({ onClick, children, className }) => (
  <button 
    onClick={onClick}
    className={`
      font-soft px-4 py-2 md:px-6 md:py-3 rounded-full 
      bg-white/10 backdrop-blur-md border border-white/20
      text-white shadow-lg transition-all duration-300
      hover:bg-white/20 hover:scale-105 active:scale-95
      flex items-center gap-2 text-sm md:text-base
      pointer-events-auto
      ${className}
    `}
  >
    {children}
  </button>
);

const LetterView: React.FC = () => {
  const { openLetter, activeLetterId, view } = useLove();
  const isVisible = view === ViewState.Letter;

  const letterContent: Record<string, string> = {
    'lonely': `My dearest **Habibti**,

I feel the miles between us today too. It's hard not being able to hold you, my **Sweetheart**.
But remember, every second that passes is a second closer to our marraige Inshallah
You are my **Qalbi**, my heart. You are never truly alone because I carry you with me everywhere I go.

Be strong for me, **Baby Girl**.
I love you endlessly.`,
    
    'anniversary': `To my beautiful **Wife**,

Can you believe how far we've come?
You are my **Queen**, the ruler of my world.
I dream of the day we wake up next to each other, no screens, no bad connections, just us.
Until then, I will keep working to build our empire, **Sayangku**.

You are my forever.`,
    
    'morning': `Good morning **Cutiee pookieee pieee**!

I hope you slept well, my **Princess**.
I wish I could be there to make you coffee and kiss your forehead.
Start your day knowing that you are the most beautiful girl in the entire universe, **My Fitru**.

**My Motuu**, **My Everything**

Yours **Mizuu** & Yours **Eidu**`
  };

  const content = activeLetterId && letterContent[activeLetterId] ? letterContent[activeLetterId] : "My love, I am thinking of you...";

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i} className="block mb-2">
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => 
          part.startsWith('**') && part.endsWith('**') ? 
            <strong key={j} className="text-pink-600 font-serif-elegant text-xl mx-1">{part.slice(2, -2)}</strong> : 
            part
        )}
      </span>
    ));
  };

  return (
    <div className={`
      absolute inset-0 flex items-center justify-center z-50 
      bg-black/70 backdrop-blur-md p-4 
      transition-all duration-700 ease-in-out pointer-events-auto
      ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
    `}>
      <div className={`
        bg-[#fff1f2] max-w-lg w-full p-8 rounded-sm 
        shadow-[0_0_50px_rgba(255,192,203,0.3)] relative 
        border border-pink-100
        transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1)
        ${isVisible ? 'scale-100 translate-y-0 rotate-1' : 'scale-75 translate-y-24 rotate-12'}
      `}>
        <button onClick={() => openLetter(null)} className="absolute top-4 right-4 text-pink-900/50 hover:text-pink-900 hover:rotate-90 transition-all pointer-events-auto">
          <X size={24} />
        </button>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-800 rounded-full flex items-center justify-center shadow-lg border-4 border-[#fff1f2]">
            <Heart className="text-red-200 fill-red-200" size={20} />
        </div>

        <h2 className="font-serif-elegant text-3xl text-pink-900 mb-6 mt-2 text-center border-b border-pink-200 pb-2">My Love Letter</h2>
        
        <div className="font-hand text-xl text-gray-800 leading-relaxed">
          {renderContent(content)}
        </div>
        
        <div className="mt-8 text-right font-serif-elegant text-pink-800 italic text-lg">
          - Forever yours
        </div>
      </div>
    </div>
  );
};

const ChatView: React.FC = () => {
  const { view, setView, messages, sendMessage, isTyping } = useLove();
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isVisible = view === ViewState.Chat;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isVisible) {
      scrollToBottom();
    }
  }, [messages, isVisible, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText("");
    }
  };

  return (
    <div className={`
      absolute inset-0 flex items-center justify-center z-50 
      bg-black/60 backdrop-blur-md p-4 
      transition-all duration-500 ease-in-out pointer-events-auto
      ${isVisible ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
    `}>
      <div className={`
        bg-white/10 backdrop-blur-xl max-w-md w-full h-[600px] rounded-2xl 
        shadow-[0_0_50px_rgba(100,0,100,0.3)] relative 
        border border-white/20 flex flex-col overflow-hidden
        transition-all duration-500 cubic-bezier(0.34, 1.56, 0.64, 1)
        ${isVisible ? 'scale-100 translate-y-0' : 'scale-90 translate-y-20'}
      `}>
        {/* Header */}
        <div className="bg-white/10 p-4 flex justify-between items-center border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center border-2 border-white/50">
               <Heart size={20} className="fill-white text-white" />
            </div>
            <div>
              <h3 className="text-white font-serif-elegant text-xl tracking-wide">My Love</h3>
              <div className="text-white/60 text-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Online
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors pointer-events-auto">
              <Phone size={20} />
            </button>
            <button onClick={() => setView(ViewState.Orbit)} className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors pointer-events-auto">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`
                max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed
                ${msg.sender === 'me' 
                  ? 'bg-pink-600 text-white rounded-tr-sm' 
                  : 'bg-white/10 text-white/90 border border-white/10 rounded-tl-sm'}
              `}>
                {msg.text}
                <div className={`text-[10px] mt-1 opacity-50 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
             <div className="flex justify-start">
               <div className="bg-white/10 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1">
                 <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></span>
                 <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                 <span className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-2">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message to your love..."
            className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:border-pink-400 focus:bg-white/10 transition-all font-soft pointer-events-auto"
          />
          <button 
            type="submit" 
            className="p-3 bg-pink-600 rounded-full text-white hover:bg-pink-500 hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50 pointer-events-auto"
            disabled={!inputText.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

const MoodSelector: React.FC = () => {
  const { mood, setMood } = useLove();
  const moods = [
    { type: Mood.Romantic, icon: Heart, color: 'text-pink-400' },
    // Removed Happy option as requested
    { type: Mood.Missing, icon: CalendarHeart, color: 'text-purple-400' },
    { type: Mood.Sleepy, icon: Moon, color: 'text-blue-400' },
  ];

  return (
    <div className="flex gap-4 bg-black/20 backdrop-blur-md p-2 rounded-full border border-white/10 pointer-events-auto">
      {moods.map((m) => (
        <button 
          key={m.type}
          onClick={() => setMood(m.type)}
          className={`p-2 rounded-full transition-all ${mood === m.type ? 'bg-white/20 scale-110' : 'opacity-70 hover:opacity-100'}`}
        >
          <m.icon className={m.color} size={20} />
        </button>
      ))}
    </div>
  );
};

const FeatureToggles: React.FC = () => {
  const { 
    setWhisperMode, 
    setView, 
    secretDrawerActive, setSecretDrawerActive,
    promiseRingActive, setPromiseRingActive
  } = useLove();
  
  const [showMenu, setShowMenu] = useState(false);

  // Helper to close menu on action
  const handleAction = (action: () => void) => {
    action();
    setShowMenu(false);
  };

  return (
    <div className="relative flex flex-col items-end gap-2 mt-4 pointer-events-auto z-50">
      
      {/* Main Toggle Button */}
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-md border border-white/20 px-4 py-2 rounded-full text-white/90 hover:text-white hover:bg-white/10 transition-all font-soft"
      >
        <Sparkles size={16} /> <span>Magic Features</span>
      </button>

      {/* Expanded Menu */}
      <div className={`
        absolute top-full right-0 mt-2
        flex flex-col gap-2 transition-all duration-300 origin-top-right
        ${showMenu ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}
      `}>
          {/* Dream Portal */}
          <ToggleBtn 
             label="Dream Portal" 
             active={false} 
             onClick={() => handleAction(() => setView(ViewState.PortalEntrance))} 
             icon={Plane} 
             color="text-purple-300" 
          />
          
          {/* Our Promise */}
          <ToggleBtn 
             label="Our Promise" 
             active={false} 
             onClick={() => handleAction(() => setView(ViewState.PromiseEntrance))} 
             icon={Gem} 
             color="text-yellow-300" 
          />
          
          <ToggleBtn 
             label="Secret Box" 
             active={secretDrawerActive} 
             onClick={() => handleAction(() => {
                 setSecretDrawerActive(true);
                 setView(ViewState.SecretBoxEntrance);
             })} 
             icon={Lock} 
             color="text-red-400" 
          />
          
          <div className="h-[1px] bg-white/10 my-1"></div>
          
          <button 
            onClick={() => handleAction(() => setWhisperMode(true))} 
            className="flex items-center gap-3 w-full bg-black/40 hover:bg-black/60 px-3 py-2 rounded-lg text-white/70 hover:text-white transition-colors text-right justify-end"
          >
             <span className="text-xs">Whisper Mode</span> <Wind size={14} /> 
          </button>
      </div>
    </div>
  );
}

const ToggleBtn: React.FC<{ label: string, active: boolean, onClick: () => void, icon: any, color: string }> = ({ label, active, onClick, icon: Icon, color }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center justify-end gap-3 w-40 px-3 py-2 rounded-lg transition-all backdrop-blur-sm border ${active ? 'bg-white/20 border-white/30' : 'bg-black/20 border-transparent hover:bg-black/30'}`}
  >
     <span className={`text-xs font-soft ${active ? 'text-white' : 'text-white/50'}`}>{label}</span>
     <Icon size={14} className={active ? color : 'text-white/30'} />
  </button>
);

export const UIOverlay: React.FC = () => {
  const { 
    triggerHug, 
    triggerKiss, 
    hugActive, 
    partnerOnline, 
    kissActive,
  } = useLove();
  
  const [lastKissMessage, setLastKissMessage] = useState<number | null>(null);

  useEffect(() => {
    if (kissActive > 0) {
      setLastKissMessage(Date.now());
      const t = setTimeout(() => setLastKissMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [kissActive]);

  return (
    <>
      <div className="absolute inset-0 z-50 pointer-events-none h-screen w-screen overflow-hidden">
        
        {/* Main Layout Container */}
        <div className="relative w-full h-full flex flex-col justify-between p-6">
          
          {/* Header */}
          <div className="flex justify-between items-start shrink-0 pointer-events-none">
            <div className="flex flex-col pointer-events-none">
              <h1 className="font-serif-elegant text-5xl text-white/90 drop-shadow-lg tracking-wide select-none">
                Us <span className="text-pink-400 font-hand">Universe</span>
              </h1>
              <div className="flex items-center gap-2 mt-2 ml-1">
                <span className={`w-2 h-2 rounded-full ${partnerOnline ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`} />
                <span className="font-soft text-sm text-white/70 tracking-wider">
                  {partnerOnline ? 'Connected by heart' : 'Waiting for love...'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2 pointer-events-auto">
              <MoodSelector />
              <FeatureToggles />
            </div>
          </div>

          {/* Footer - Increased bottom padding for mobile to avoid cut-off */}
          <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto pb-24 md:pb-4 shrink-0 pointer-events-none">
            <div className="flex justify-center gap-6 items-center pointer-events-auto">
              <Button onClick={triggerHug} className="bg-gradient-to-r from-orange-400/20 to-pink-500/20 hover:from-orange-400/30 hover:to-pink-500/30">
                <Star size={18} /> Hug
              </Button>
              
              <div className="relative group pointer-events-auto">
                <button className="w-20 h-20 rounded-full bg-gradient-to-t from-pink-600 to-rose-400 flex items-center justify-center shadow-[0_0_40px_rgba(244,114,182,0.5)] hover:scale-110 hover:shadow-[0_0_60px_rgba(244,114,182,0.7)] transition-all duration-300 active:scale-95 border-4 border-white/10" onClick={triggerKiss}>
                   <Heart className="fill-white text-white animate-pulse" size={36} />
                </button>
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-white/90 text-sm font-soft opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                  Send Kiss
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Messages */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[-1]">
          {hugActive && (
            <div className="flex flex-col items-center">
                <div className="font-hand text-7xl md:text-8xl text-pink-200 drop-shadow-[0_0_30px_rgba(255,105,180,0.8)] animate-pulse tracking-wide scale-110 transition-transform duration-1000 text-center px-4">
                  Sending a tight hug...
                </div>
                <div className="mt-6 text-6xl animate-bounce drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
                    🫂💖
                </div>
            </div>
          )}
          {lastKissMessage && (
             <div className="font-hand text-5xl text-pink-200 drop-shadow-[0_0_10px_rgba(244,114,182,0.8)] animate-float">
               Muah! 😘
             </div>
          )}
        </div>

        <LetterView />
        <ChatView />
      </div>
      
      <WhisperOverlay />
      <PortalOverlay />
      <PromiseOverlay />
      <SecretBoxOverlay />
      <FeatureModals />
    </>
  );
};