import React, { useEffect, useState } from 'react';
import { useLove } from '../../store';
import { X } from 'lucide-react';

const WHISPERS = [
  "Come closer...",
  "I need to tell you something...",
  "You're the most beautiful thing in my universe...",
  "I can't stop thinking about you...",
  "Every moment with you feels like magic...",
  "You're my everything...",
  "I wish you were here right now...",
  "The distance means nothing when you mean everything...",
  "I love the way you love me..."
];

export const WhisperOverlay: React.FC = () => {
  const { whisperMode, setWhisperMode } = useLove();
  const [currentText, setCurrentText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!whisperMode) {
      setCurrentText("");
      setIndex(0);
      return;
    }

    let charIndex = 0;
    const textToType = WHISPERS[index % WHISPERS.length];
    
    // Typewriter effect
    const typeInterval = setInterval(() => {
      if (charIndex <= textToType.length) {
        setCurrentText(textToType.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        // Wait then next message
        setTimeout(() => {
           setIndex(prev => prev + 1);
        }, 3000);
      }
    }, 100);

    return () => clearInterval(typeInterval);
  }, [whisperMode, index]);

  if (!whisperMode) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center pointer-events-auto transition-opacity duration-1000">
      <button 
        onClick={() => setWhisperMode(false)}
        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
      >
        <X size={32} />
      </button>

      <div className="text-center max-w-2xl px-6">
        <p className="font-hand text-4xl md:text-6xl text-pink-200 drop-shadow-[0_0_15px_rgba(255,192,203,0.5)] leading-relaxed">
          {currentText}
          <span className="animate-pulse">|</span>
        </p>
      </div>
    </div>
  );
};