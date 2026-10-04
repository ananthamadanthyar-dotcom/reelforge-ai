"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowRight, ArrowLeft, PlayCircle, PauseCircle, ChevronDown, CheckCircle2 } from "lucide-react";

const LANGUAGES = [
  "English", "Spanish", "French", "German", 
  "Hindi", "Italian", "Portuguese", "Japanese"
];

// Added 'previewAudio' paths here! 
const VOICES = [
  { 
    id: "adam", 
    name: "Adam", 
    gender: "Male", 
    description: "The well known voice of tiktok and instagram.",
    previewAudio: "/voices/adam.mp3"
  },
  { 
    id: "john", 
    name: "John", 
    gender: "Male", 
    description: "The perfect storyteller, very realistic and natural.",
    previewAudio: "/voices/john.mp3" 
  },
  { 
    id: "sarah", 
    name: "Sarah", 
    gender: "Female", 
    description: "Clear, engaging, professional, and highly articulate.",
    previewAudio: "/voices/sarah.mp3" 
  },
  { 
    id: "emily", 
    name: "Emily", 
    gender: "Female", 
    description: "Warm, conversational, and highly relatable tone.",
    previewAudio: "/voices/emily.mp3" 
  }
];

export function LanguageVoiceGenerator({ 
  onContinue, 
  onBack 
}: { 
  onContinue: () => void;
  onBack: () => void;
}) {
  const [selectedLanguage, setSelectedLanguage] = useState("English");
  const [selectedVoice, setSelectedVoice] = useState("john");
  
  // Audio playback state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Stop audio if the user leaves the page
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handlePlayAudio = (e: React.MouseEvent, voiceId: string, audioUrl: string) => {
    e.stopPropagation(); // Prevents selecting the voice when just clicking play

    // If clicking the currently playing audio, pause it
    if (playingId === voiceId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    // Stop any existing audio before playing a new one
    if (audioRef.current) {
      audioRef.current.pause();
    }

    // Play the new audio
    const newAudio = new Audio(audioUrl);
    
    newAudio.play().catch((error) => {
      console.error("Audio playback failed:", error);
      alert("Audio file not found! Please place your mp3 files in the 'public/voices/' folder.");
      setPlayingId(null);
    });

    // When audio finishes, reset the button icon back to Play
    newAudio.onended = () => {
      setPlayingId(null);
    };

    audioRef.current = newAudio;
    setPlayingId(voiceId);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <p className="text-slate-400 -mt-6">Choose the language and voice style for your video</p>

      <div className="space-y-6 max-w-2xl">
        
        {/* Language Dropdown */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300">Language</label>
          <div className="relative">
            <select 
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full appearance-none bg-slate-900 border border-slate-800 rounded-xl p-4 pr-10 text-sm text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer"
            >
              {LANGUAGES.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Voice Selection */}
        <div className="space-y-3 pt-2">
          <label className="text-sm font-medium text-slate-300">Voice Style</label>
          
          <div className="space-y-3">
            {VOICES.map((voice) => {
              const isSelected = selectedVoice === voice.id;
              const isPlaying = playingId === voice.id;
              
              return (
                <div 
                  key={voice.id}
                  onClick={() => setSelectedVoice(voice.id)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? "bg-purple-900/10 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.1)]" 
                      : "bg-slate-900 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold ${isSelected ? "text-white" : "text-slate-200"}`}>
                        {voice.name}
                      </h4>
                      <span className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {voice.gender}
                      </span>
                    </div>
                    <p className={`text-sm ${isSelected ? "text-purple-300" : "text-slate-500"}`}>
                      {voice.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {isSelected && <CheckCircle2 className="w-5 h-5 text-purple-500" />}
                    
                    {/* The Play/Pause Button */}
                    <button 
                      onClick={(e) => handlePlayAudio(e, voice.id, voice.previewAudio)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        isPlaying 
                          ? "bg-purple-500 text-white shadow-lg shadow-purple-500/30" 
                          : "bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                      }`}
                    >
                      {isPlaying ? (
                        <PauseCircle className="w-6 h-6" />
                      ) : (
                        <PlayCircle className="w-6 h-6" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-800/50">
        <button 
          onClick={onBack}
          className="px-6 py-2.5 text-slate-400 hover:text-white font-medium text-sm transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        
        <button 
          onClick={onContinue}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition flex items-center shadow-lg shadow-purple-500/20"
        >
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}