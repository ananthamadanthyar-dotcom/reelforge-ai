"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";

export function EffectsGenerator({ 
  onContinue, 
  onBack 
}: { 
  onContinue: () => void;
  onBack: () => void;
}) {
  // In the video, glitch effect is toggled on by default
  const [glitchEffect, setGlitchEffect] = useState(true);
  const [animatedHook, setAnimatedHook] = useState(false);
  const [videoModel, setVideoModel] = useState("wan-2.2");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <p className="text-slate-400 -mt-6">Add visual effects to make your videos more engaging and eye-catching.</p>

      <div className="space-y-4 max-w-3xl pt-2">
        
        {/* Glitch Effect Toggle */}
        <div className="flex items-start justify-between p-5 rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-slate-700">
          <div className="pr-8">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-white">Glitch effect</h4>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                NEW
              </span>
            </div>
            <p className="text-sm text-slate-400">
              Glitches the subject with chromatic distortion and eerie shake - perfect for horror, thrillers, and scary content.
            </p>
          </div>
          
          {/* Custom Toggle Switch */}
          <button 
            onClick={() => setGlitchEffect(!glitchEffect)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${glitchEffect ? 'bg-purple-600' : 'bg-slate-700'}`}
          >
            <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${glitchEffect ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Animated Hook Toggle */}
        <div className={`p-5 rounded-xl border transition-all ${animatedHook ? 'border-purple-500/50 bg-purple-900/10' : 'border-slate-800 bg-slate-900 hover:border-slate-700'}`}>
          <div className="flex items-start justify-between">
            <div className="pr-8">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-bold text-white">Animated hook</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 flex items-center">
                  <Sparkles className="w-3 h-3 mr-1" /> PREMIUM
                </span>
              </div>
              <p className="text-sm text-slate-400">
                Generate a 5-second motion video for the first scene to hook viewers instantly.
              </p>
            </div>
            
            <button 
              onClick={() => setAnimatedHook(!animatedHook)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${animatedHook ? 'bg-purple-600' : 'bg-slate-700'}`}
            >
              <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${animatedHook ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Expanded Premium Options (Only shows if toggled on) */}
          {animatedHook && (
            <div className="mt-6 pt-6 border-t border-slate-800/50 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-medium text-slate-300 block mb-2">Video model</label>
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <select 
                  value={videoModel}
                  onChange={(e) => setVideoModel(e.target.value)}
                  className="w-full sm:w-64 appearance-none bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer"
                >
                  <option value="wan-2.2">Wan 2.2 - 10 credits</option>
                  <option value="luma">Luma Dream Machine - 15 credits</option>
                </select>
                <p className="text-sm text-slate-500">
                  Cost per video: <span className="text-purple-400 font-medium">10 premium credits</span>
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-slate-800">
        <button 
          onClick={onBack}
          className="px-6 py-2.5 text-slate-400 hover:text-white font-medium text-sm transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </button>
        
        <button 
          onClick={onContinue}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg shadow-purple-500/25"
        >
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}