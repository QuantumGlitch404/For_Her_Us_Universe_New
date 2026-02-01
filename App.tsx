import React from 'react';
import { LoveProvider, useLove } from './store';
import { LoveScene } from './components/3d/LoveScene';
import { UIOverlay } from './components/ui/UIOverlay';
import { HeartCursor } from './components/ui/HeartCursor';
import { Mood } from './types';

const AppContent: React.FC = () => {
  const { mood, hugActive } = useLove();

  // Dynamic Background Gradient based on Mood
  const getBackgroundClass = () => {
    switch(mood) {
      case Mood.Missing: return 'bg-gradient-to-b from-[#0f0c29] via-[#302b63] to-[#24243e]';
      case Mood.Sleepy: return 'bg-gradient-to-b from-[#000428] to-[#004e92]';
      case Mood.Happy: return 'bg-gradient-to-b from-[#ff9a9e] to-[#fecfef]';
      default: return 'bg-gradient-to-b from-[#2d0b1e] via-[#4d0f28] to-[#1a0510]';
    }
  };

  return (
    <div className={`relative w-full h-screen transition-colors duration-1000 ${getBackgroundClass()}`}>
      <HeartCursor />
      
      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none z-10" />
      
      {/* Blur Overlay for "Hug" Effect */}
      <div className={`absolute inset-0 z-20 pointer-events-none transition-all duration-1000 ${hugActive ? 'backdrop-blur-sm bg-pink-500/10' : 'backdrop-blur-none'}`} />

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <LoveScene />
      </div>

      {/* UI Layer */}
      <UIOverlay />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LoveProvider>
      <AppContent />
    </LoveProvider>
  );
};

export default App;