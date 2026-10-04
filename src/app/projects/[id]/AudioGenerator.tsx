"use client";

import { useState, useEffect } from "react";
import { Mic2, PlayCircle, Square, CheckCircle2, Volume2, Sparkles } from "lucide-react";

const availableVoices = [
  { id: "v1", name: "Marcus", style: "Deep & Authoritative", gender: "Male", accent: "American", gradient: "from-blue-600 to-cyan-600" },
  { id: "v2", name: "Sarah", style: "Energetic & Engaging", gender: "Female", accent: "American", gradient: "from-purple-600 to-pink-600" },
  { id: "v3", name: "Arthur", style: "Calm Storyteller", gender: "Male", accent: "British", gradient: "from-amber-600 to-orange-600" },
  { id: "v4", name: "Emma", style: "Professional & Clear", gender: "Female", accent: "British", gradient: "from-emerald-600 to-teal-600" },
  { id: "v5", name: "Jordan", style: "Young & Trendy (TikTok)", gender: "Male", accent: "American", gradient: "from-rose-600 to-red-600" },
  { id: "v6", name: "Elena", style: "Soft & ASMR", gender: "Female", accent: "American", gradient: "from-indigo-600 to-violet-600" },
];

// FIXED: onContinue is safely back in the props!
export function AudioGenerator({ projectId, onContinue }: { projectId: string; onContinue?: () => void }) {
  const [selectedVoice, setSelectedVoice] = useState("v1");
  const [playingVoice, setPlayingVoice] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const togglePlay = (voice: any) => {
    window.speechSynthesis.cancel();

    if (playingVoice === voice.id) {
      setPlayingVoice(null); 
      return;
    }

    setPlayingVoice(voice.id);

    const textToSpeak = `Hi, I am ${voice.name}. This is a preview of my ${voice.style} voice.`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    utterance.onend = () => {
      setPlayingVoice(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Mic2 className="w-5 h-5 text-indigo-400" /> 3. Voice & Audio
          </h3>
          <p className="text-sm text-slate-400">
            Select the perfect AI voice actor to narrate your script. Powered by advanced Text-to-Speech models.
          </p>
        </div>
        <div className="hidden sm:flex items-center px-4 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20 text-sm font-medium">
          <Sparkles className="w-4 h-4 mr-2" />
          Auto-Sync Enabled
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableVoices.map((voice) => {
          const isSelected = selectedVoice === voice.id;
          
          return (
            <div 
              key={voice.id}
              onClick={() => setSelectedVoice(voice.id)}
              className={`relative p-1 rounded-xl cursor-pointer transition-all duration-200 ${
                isSelected ? `bg-gradient-to-r ${voice.gradient} shadow-lg scale-[1.02]` : 'bg-transparent hover:bg-slate-800'
              }`}
            >
              <div className={`h-full p-5 rounded-lg flex flex-col justify-between ${
                isSelected ? 'bg-slate-950' : 'bg-slate-900 border border-slate-800'
              }`}>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex space-x-2">
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] uppercase tracking-wider rounded font-medium">
                      {voice.gender}
                    </span>
                    <span className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] uppercase tracking-wider rounded font-medium">
                      {voice.accent}
                    </span>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-indigo-500' : 'border border-slate-600'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-lg font-bold text-white mb-1">{voice.name}</h4>
                  <p className="text-sm text-slate-400">{voice.style}</p>
                </div>

                <button 
                  onClick={(e) => {
                    e.stopPropagation(); 
                    togglePlay(voice); 
                  }}
                  className={`w-full py-2.5 rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
                    playingVoice === voice.id 
                      ? 'bg-slate-800 text-indigo-400' 
                      : 'bg-slate-800/50 hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  {playingVoice === voice.id ? (
                    <><Square className="w-4 h-4 mr-2 fill-current" /> Stop Preview</>
                  ) : (
                    <><PlayCircle className="w-4 h-4 mr-2" /> Listen to Sample</>
                  )}
                </button>

              </div>
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row gap-6 items-center justify-between">
        <div className="flex-1 w-full">
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-300 flex items-center">
              <Volume2 className="w-4 h-4 mr-2" /> Background Music Volume
            </label>
            <span className="text-sm text-slate-400">15%</span>
          </div>
          <input type="range" min="0" max="100" defaultValue="15" className="w-full accent-indigo-500 bg-slate-800 rounded-lg h-2" />
        </div>
        
        {/* FIXED: Hooked up the click event to trigger the tab slide */}
        <button 
          onClick={onContinue}
          className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-500/25 whitespace-nowrap"
        >
          Save & Continue to Captions
        </button>
      </div>
    </div>
  );
}