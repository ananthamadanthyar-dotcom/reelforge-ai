"use client";

import { useState } from "react";
import { Music, Upload, X, Volume2, ArrowRight, ArrowLeft } from "lucide-react";

const PRESET_TRACKS = [
  { id: "1", name: "Cinematic Tension", genre: "Suspense / Horror", duration: "2:15" },
  { id: "2", name: "Lo-Fi Chill Beats", genre: "Relaxed / Storytelling", duration: "3:00" },
  { id: "3", name: "Epic Orchestral Rise", genre: "History / Epic", duration: "1:45" },
  { id: "4", name: "Cyberpunk Synthwave", genre: "Sci-Fi / Modern", duration: "2:30" }
];

interface BackgroundMusicProps {
  onBack: () => void;
  onContinue: () => void;
  initialTrack?: string;
}

export function BackgroundMusicGenerator({ onBack, onContinue, initialTrack = "" }: BackgroundMusicProps) {
  const [selectedTrack, setSelectedTrack] = useState<string>(initialTrack || PRESET_TRACKS[0].name);
  const [musicMode, setMusicMode] = useState<"preset" | "upload">("preset");
  const [uploadedFile, setUploadedFile] = useState<{ name: string; url: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setUploadedFile({
        name: file.name,
        url: dataUrl
      });
      setSelectedTrack(`Custom: ${file.name}`);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-slate-50">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Background Music</h2>
        <p className="text-slate-400">Select a curated preset track or upload your own audio file.</p>
      </div>

      <div className="space-y-6">
        
        {/* Mode Switcher */}
        <div className="flex bg-slate-950 border border-slate-800 rounded-xl p-2">
          <button 
            type="button"
            onClick={() => setMusicMode("preset")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${musicMode === "preset" ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Music className="w-4 h-4" /> Preset Library
          </button>
          <button 
            type="button"
            onClick={() => setMusicMode("upload")}
            className={`flex-1 py-3 text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 ${musicMode === "upload" ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            <Upload className="w-4 h-4" /> Upload Custom Audio
          </button>
        </div>

        {musicMode === "preset" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in duration-300">
            {PRESET_TRACKS.map((track) => (
              <div 
                key={track.id}
                onClick={() => setSelectedTrack(track.name)}
                className={`p-5 rounded-2xl cursor-pointer border transition-all flex flex-col justify-between ${
                  selectedTrack === track.name 
                    ? "bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Music className={`w-5 h-5 ${selectedTrack === track.name ? "text-purple-400" : "text-slate-500"}`} />
                    <span className="text-xs text-slate-500 font-mono px-2 py-0.5 bg-slate-900 rounded border border-slate-800">{track.duration}</span>
                  </div>
                  <h4 className="font-bold text-white text-base mb-1">{track.name}</h4>
                  <p className="text-xs text-slate-400">{track.genre}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-in fade-in duration-300 space-y-4">
            {uploadedFile ? (
              <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <Volume2 className="w-6 h-6 text-purple-400 flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-sm font-medium text-white truncate">{uploadedFile.name}</p>
                    <p className="text-xs text-slate-500">Custom audio file ready</p>
                  </div>
                </div>
                <button 
                  onClick={() => setUploadedFile(null)}
                  className="bg-red-500/80 hover:bg-red-500 text-white p-2 rounded-full transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="relative w-full border-2 border-dashed border-slate-700 hover:border-purple-500 bg-slate-950/50 rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <input 
                  type="file" 
                  accept="audio/mp3, audio/wav, audio/mpeg" 
                  onChange={handleFileUpload}
                  className="hidden" 
                />
                <Upload className="w-10 h-10 mb-3 text-slate-500 group-hover:text-purple-400 transition-colors" />
                <p className="text-sm text-slate-300 font-medium mb-1">
                  Click to upload custom audio file
                </p>
                <p className="text-xs text-slate-500">MP3 or WAV (Max 20MB)</p>
              </label>
            )}
          </div>
        )}

      </div>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-800">
        <button 
          onClick={onBack}
          className="flex items-center px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        
        <button 
          onClick={onContinue}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full px-8 py-3 shadow-lg shadow-purple-900/20 transition-all"
        >
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}