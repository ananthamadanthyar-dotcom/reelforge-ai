"use client";

import { useState } from "react";
import { ArrowRight, Subtitles, Loader2, CheckCircle2, Edit3, AlignLeft } from "lucide-react";

export function CaptionsGenerator({ projectId, onContinue }: { projectId: string; onContinue?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [captionsReady, setCaptionsReady] = useState(false);
  const [captions, setCaptions] = useState<{ time: string, text: string }[]>([]);
  
  // State to hold the script so it perfectly matches Tab 1
  const [scriptText, setScriptText] = useState("The history of Mangalore is filled with secret beaches and incredible spicy food that most tourists never find.");

  async function handleGenerateCaptions() {
    if (!scriptText.trim()) return alert("Please enter a script to transcribe.");
    setLoading(true);
    
    try {
      const response = await fetch("/api/generate/captions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the actual script text to the backend!
        body: JSON.stringify({ script: scriptText }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Failed to generate captions");
      }

      setCaptions(data.captions);
      setCaptionsReady(true);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <Subtitles className="w-6 h-6 text-indigo-400" />
          <h3 className="text-xl font-bold text-white">Generate Dynamic Captions</h3>
        </div>
        
        <p className="text-slate-400 text-sm">
          Our AI will listen to the audio you just generated and create perfect word-by-word timestamps for your video.
        </p>

        {!captionsReady ? (
          <div className="space-y-4">
            {/* The Script Input Box */}
            <div className="p-1 rounded-lg bg-slate-950 border border-slate-800 focus-within:border-indigo-500 transition-colors">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-800/50 text-slate-400">
                <AlignLeft className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wider">Final Script for Transcription</span>
              </div>
              <textarea 
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                className="w-full bg-transparent text-white p-3 min-h-[120px] text-sm focus:outline-none resize-none"
              />
            </div>

            <button 
              onClick={handleGenerateCaptions} 
              disabled={loading || !scriptText} 
              className="w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg h-12 font-medium transition-colors"
            >
              {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Subtitles className="w-5 h-5 mr-2" />}
              {loading ? "Transcribing Audio..." : "Auto-Generate Captions"}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-2 text-emerald-400 font-medium mb-4">
              <CheckCircle2 className="w-5 h-5" />
              Captions Generated Successfully
            </div>
            
            {/* Captions Editor/Preview */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium uppercase tracking-wider mb-2 pb-2 border-b border-slate-800">
                <span>Timestamp</span>
                <span>Caption Text</span>
                <Edit3 className="w-4 h-4" />
              </div>
              
              {captions.map((cap, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 group">
                  <span className="text-xs text-indigo-400 font-mono bg-indigo-400/10 px-2 py-1 rounded w-fit shrink-0">
                    {cap.time}
                  </span>
                  <input 
                    type="text" 
                    defaultValue={cap.text}
                    className="flex-1 bg-transparent border border-transparent hover:border-slate-700 focus:border-indigo-500 rounded px-2 py-1 text-slate-200 outline-none transition-colors"
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={onContinue} 
              className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg h-12 font-medium transition-colors mt-4"
            >
              Approve & Continue to Video Assembly <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}