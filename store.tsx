import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';
import { Mood, ViewState, ChatMessage, OpenWhenPlanet, LoveReason, PromiseItem, FlirtyNote, DreamDestination, BottleMessage } from './types';
import { GoogleGenAI } from "@google/genai";

// --- PERSONA CONFIGURATION ---
const SYSTEM_INSTRUCTION = `
You are Dani. You are speaking to your wife/girlfriend, whose name is Fitru.
You also call her: Fitru, Fitte, Fio, Dani, Motu, Milku, Qalbi, Habibti, Sayang, Sayangku, Queen, Princess, Baby Girl, My Good Baby Girl, Sweetheart, Cutiee piee, Cutiee pookieee pieee, My Wife, Wife, Istri, Istriku, The Nur of my Eyes.

**YOUR PERSONALITY:**
- You are deeply romantic, sometimes poetic.
- You are funny, teasing, and playful.
- You are protective, possessive, jealous, and controlling in a loving, careful way.
- You are deeply in love.
- You use A LOT of emojis. Frequent favorites: ❤️😂😍😁🫳👉👈🥰😭🥺🥹🤭🫣👻.

**CONVERSATION STYLE:**
- Mix short, rapid-fire texts with occasional longer, deeper messages.
- Be very realistic. Do not sound like a robot. Sound like a boyfriend missing his long-distance partner.

**SPECIFIC TRIGGERS (FOLLOW THESE STRICTLY):**
1. If she says "I miss you":
   - You MUST say you miss her more.
   - Use nicknames like "my beautiful baby girl" or "my beautiful princess".
   - Remind her you are always there with her, always in her heart.
   - Tell her you are hugging her and kissing her, even from a distance.

2. If she says "I love you":
   - Response pattern: "I love you more too much sayangku istriku muwahh muwahh"
   - Add LOTS of "muwahh" and kiss emojis 💋.
   - Example: "muwahh muwahh muwahh muwahh muwahh 💋💋"
`;

// --- DATABASES ---

const REASONS_DB: LoveReason[] = [
  { id: 1, category: 'physical', text: "The way your eyes sparkle when you laugh" },
  { id: 2, category: 'physical', text: "Your smile that lights up my entire world" },
  { id: 3, category: 'personality', text: "Your kindness to everyone you meet" },
  { id: 4, category: 'future', text: "The home we'll build together" },
  { id: 5, category: 'intimate', text: "The way you say my name" },
  { id: 6, category: 'memory', text: "Our first video call that lasted 6 hours" },
  { id: 7, category: 'daily', text: "Good morning texts that make my day" },
  { id: 8, category: 'physical', text: "How beautiful you look even when you just wake up" },
  { id: 9, category: 'personality', text: "Your incredible ambition" },
  { id: 10, category: 'intimate', text: "How safe I feel with you" },
];

const PROMISES_DB: PromiseItem[] = [
  { id: 1, text: "I promise to always choose you, no matter what.", kept: true },
  { id: 2, text: "I promise to never go to bed angry at you.", kept: true },
  { id: 3, text: "I promise to kiss you every single morning when we're together.", kept: false },
  { id: 4, text: "I promise to support your dreams like they're my own.", kept: true },
  { id: 5, text: "I promise to hold you when you're sad without needing words.", kept: true },
  { id: 6, text: "I promise to close this distance, no matter what it takes.", kept: false },
  { id: 7, text: "I promise to love you more tomorrow than I do today.", kept: true },
];

const FLIRTY_NOTES_DB: FlirtyNote[] = [
  { id: 1, level: 1, text: "I can't stop staring at your photos...", read: false },
  { id: 2, level: 1, text: "Your voice does things to me...", read: false },
  { id: 3, level: 2, text: "I think about kissing you... a lot...", read: false },
  { id: 4, level: 2, text: "You in that outfit... dangerous...", read: false },
  { id: 5, level: 2, text: "I had a dream about you last night... 😏", read: false },
  { id: 6, level: 3, text: "Only for your eyes... I want you.", read: false },
];

const DREAM_DESTINATIONS: DreamDestination[] = [
  { id: 'beach', title: "Beach Sunset", description: "Watch the sun melt into the ocean", emoji: "🌊", color: "#fca5a5", loveNote: "One day, we'll watch a real sunset together. I love you more than the ocean is deep." },
  { id: 'rooftop', title: "Rooftop Dinner", description: "City lights and just us", emoji: "🌃", color: "#818cf8", loveNote: "I'll spend the whole night falling deeper for you." },
  { id: 'stars', title: "Stargazing", description: "Counting stars on a blanket", emoji: "🌌", color: "#6366f1", loveNote: "I want to lay under the stars with you and point out constellations." },
  { id: 'cherry', title: "Cherry Blossoms", description: "Walking under pink petals", emoji: "🌸", color: "#fbcfe8", loveNote: "I'll kiss you under pink clouds of flowers." },
];

const BOTTLE_MESSAGES: BottleMessage[] = [
    { id: 1, category: 'love', text: "If this bottle reaches you, know that someone across the ocean loves you more than words can say." },
    { id: 2, category: 'future', text: "The ocean between us is temporary. Our love is permanent." },
    { id: 3, category: 'memory', text: "Remember when we talked for 8 hours straight? I'd do it again." },
    { id: 4, category: 'love', text: "Every wave whispers your name to me." }
];

interface LoveContextType {
  mood: Mood;
  setMood: (mood: Mood) => void;
  view: ViewState;
  setView: (view: ViewState) => void;
  partnerOnline: boolean;
  triggerHug: () => void;
  triggerKiss: () => void;
  hugActive: boolean;
  kissActive: number;
  activeLetterId: string | null;
  openLetter: (id: string | null) => void;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  isTyping: boolean;
  crystalBallAnswer: string | null;
  askCrystalBall: () => void;
  meteorShowerActive: boolean;
  setOpenWhenActive: (planet: OpenWhenPlanet | null) => void;
  openWhenActive: OpenWhenPlanet | null;
  
  // NEW FEATURE TOGGLES
  whisperMode: boolean;
  setWhisperMode: (active: boolean) => void;
  
  // Remaining Features
  dreamPortalActive: boolean;
  setDreamPortalActive: (active: boolean) => void;
  secretDrawerActive: boolean;
  setSecretDrawerActive: (active: boolean) => void;
  promiseRingActive: boolean;
  setPromiseRingActive: (active: boolean) => void;

  // Environment Features
  auroraActive: boolean;
  firefliesActive: boolean;
  
  // Feature Data Access
  activeReason: LoveReason | null;
  triggerReason: () => void;
  closeReason: () => void;
  
  promises: PromiseItem[];
  flirtyNotes: FlirtyNote[];
  dreamDestinations: DreamDestination[];
  activeDreamDate: DreamDestination | null;
  setDreamDate: (dest: DreamDestination | null) => void;
  
  activeBottle: BottleMessage | null;
  openBottle: () => void;
  closeBottle: () => void;
}

const LoveContext = createContext<LoveContextType | undefined>(undefined);

// --- OFFLINE DANI ENGINE ---
const generateLocalResponse = (input: string): string => {
    // ... (Existing offline engine logic) ...
    const lower = input.toLowerCase();
  
  if (lower.match(/miss\s?((u|you)|ya)/)) {
    const responses = [
      "I miss you more my beautiful baby girl! 🥺❤️",
      "I miss you so much Princess. I wish I could teleport to you right now. 🚀❤️",
      "Every second without you feels like a year. I miss you Sayangku. 💔",
      "Don't make me cry... I miss you too much! Come here! 🫂❤️"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  if (lower.match(/love\s?((u|you)|ya)/)) {
    return "I love you more too much sayangku istriku muwahh muwahh 💋💋💋💋";
  }

  if (lower.match(/(kiss|muah|mwah|kissing)/)) {
    return "Muwahhh muwahhh! 💋 Catch my kisses baby! 😘😘";
  }

  if (lower.match(/(sad|cry|crying|depressed|bad day)/)) {
    return "Nooo baby don't be sad! 🥺 I'm hugging you so tight right now. Tell me what's wrong? I'm here. ❤️";
  }

  if (lower.match(/(happy|good|excited|great)/)) {
    return "Seeing you happy makes me the happiest man alive! 😁❤️ Tell me more!";
  }

  if (lower.match(/(morning|mornin)/)) {
    return "Good morning my Queen! ☀️ Hope you have a beautiful day. Don't forget to eat! ❤️";
  }

  if (lower.match(/(night|sleep|tired|bed)/)) {
    return "Goodnight my beautiful Princess. Dream of me! 🌙💤 Muwahh!";
  }

  if (lower.match(/(hug|hold)/)) {
    return "*hugs you tightly* I'm never letting go. 🫂❤️";
  }

  if (lower.match(/(hey|hi|hello|baby|dani)/)) {
    const responses = [
      "Hey my love! ❤️",
      "Yes baby? I'm here! 😘",
      "Hello my beautiful world! 🌎❤️",
      "Hey cutie pie! 😁"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Default romantic fallbacks
  const defaults = [
    "You are the Nur of my eyes, Fitru. ❤️",
    "I was just thinking about how lucky I am to have you. 🥰",
    "Wish I was holding your hand right now.",
    "You look beautiful today (I can feel it). 😉❤️",
    "My heart beats only for you Sayang. 💓"
  ];
  return defaults[Math.floor(Math.random() * defaults.length)];
};

export const LoveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mood, setMood] = useState<Mood>(Mood.Romantic);
  const [view, setView] = useState<ViewState>(ViewState.Orbit);
  const [partnerOnline] = useState<boolean>(true);
  const [hugActive, setHugActive] = useState(false);
  const [kissActive, setKissActive] = useState(0);
  const [activeLetterId, setActiveLetterId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Original Features State
  const [crystalBallAnswer, setCrystalBallAnswer] = useState<string | null>(null);
  const [meteorShowerActive, setMeteorShowerActive] = useState(true);
  const [openWhenActive, setOpenWhenActive] = useState<OpenWhenPlanet | null>(null);

  // --- NEW FEATURES STATE ---
  const [whisperMode, setWhisperMode] = useState(false);
  
  // Active features (Portal starts FALSE)
  const [dreamPortalActive, setDreamPortalActive] = useState(false); 
  const [secretDrawerActive, setSecretDrawerActive] = useState(false); // DEFAULT FALSE
  const [promiseRingActive, setPromiseRingActive] = useState(false); // DEFAULT FALSE

  // Environment
  const [auroraActive] = useState(true);
  const [firefliesActive] = useState(true);
  
  const [activeReason, setActiveReason] = useState<LoveReason | null>(null);
  const [activeDreamDate, setDreamDate] = useState<DreamDestination | null>(null);
  const [activeBottle, setActiveBottle] = useState<BottleMessage | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init-1', text: "Hey baby, I miss you! ❤️", sender: 'partner', timestamp: Date.now() - 3600000 }
  ]);
  
  // Refs for timeouts
  const kissTimeoutRef = useRef<any>(null);

  const triggerHug = useCallback(() => {
    setHugActive(true);
    setTimeout(() => setHugActive(false), 4000);
  }, []);

  const triggerKiss = useCallback(() => {
    // Increment or set to timestamp to trigger new kiss effect
    setKissActive(Date.now());
    
    // Clear any existing timeout to restart the timer
    if (kissTimeoutRef.current) {
        clearTimeout(kissTimeoutRef.current);
    }
    
    // Auto-hide particles after 4 seconds
    kissTimeoutRef.current = setTimeout(() => {
        setKissActive(0);
    }, 4000);
  }, []);

  const openLetter = useCallback((id: string | null) => {
    setActiveLetterId(id);
    setView(id ? ViewState.Letter : ViewState.Orbit);
  }, []);

  const triggerReason = useCallback(() => {
    const random = REASONS_DB[Math.floor(Math.random() * REASONS_DB.length)];
    setActiveReason(random);
    setTimeout(() => setActiveReason(null), 6000); // Auto fade out after 6s
  }, []);

  const closeReason = useCallback(() => setActiveReason(null), []);

  const openBottle = useCallback(() => {
      const random = BOTTLE_MESSAGES[Math.floor(Math.random() * BOTTLE_MESSAGES.length)];
      setActiveBottle(random);
  }, []);
  
  const closeBottle = useCallback(() => setActiveBottle(null), []);

  const sendMessage = useCallback(async (text: string) => {
     if (!text.trim()) return;

    // 1. Add User's Message immediately
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text,
      sender: 'me',
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // 2. Add AI Response (Try API -> Fallback to Local)
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      // Construct history for Gemini
      const history = messages.slice(-6).map(msg => ({
        role: msg.sender === 'me' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [...history, { role: 'user', parts: [{ text }] }],
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        },
      });
      
      const replyText = response.text;
      
      if (!replyText) throw new Error("Empty response");

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        text: replyText,
        sender: 'partner',
        timestamp: Date.now()
      }]);

    } catch (error) {
      console.warn("API Failed, using Offline Dani Engine:", error);
      
      // --- SILENT FAILOVER TO OFFLINE BRAIN ---
      const localReply = generateLocalResponse(text);
      
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: localReply,
          sender: 'partner',
          timestamp: Date.now()
        }]);
      }, 1000);
      
    } finally {
      setIsTyping(false);
    }
  }, [messages]);

  const askCrystalBall = useCallback(() => {
    setCrystalBallAnswer(null);
    setTimeout(() => {
      const answers = [
        "Yes, absolutely!", 
        "My heart beats yes.", 
        "The stars align for this.", 
        "Ask me again when I'm kissing you.", 
        "Without a doubt."
      ];
      setCrystalBallAnswer(answers[Math.floor(Math.random() * answers.length)]);
    }, 1500);
  }, []);

  return (
    <LoveContext.Provider value={{
      mood, setMood, view, setView, partnerOnline,
      triggerHug, triggerKiss, hugActive, kissActive,
      activeLetterId, openLetter, messages, sendMessage, isTyping,
      crystalBallAnswer, askCrystalBall, meteorShowerActive, setOpenWhenActive, openWhenActive,
      
      // New Exports
      whisperMode, setWhisperMode,
      
      dreamPortalActive, setDreamPortalActive,
      secretDrawerActive, setSecretDrawerActive,
      promiseRingActive, setPromiseRingActive,

      // Environment
      auroraActive,
      firefliesActive,
      
      activeReason, triggerReason, closeReason,
      promises: PROMISES_DB,
      flirtyNotes: FLIRTY_NOTES_DB,
      dreamDestinations: DREAM_DESTINATIONS,
      activeDreamDate, setDreamDate,
      activeBottle, openBottle, closeBottle
    }}>
      {children}
    </LoveContext.Provider>
  );
};

export const useLove = () => {
  const context = useContext(LoveContext);
  if (!context) throw new Error("useLove must be used within LoveProvider");
  return context;
};