"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, CheckCircle2, Type } from "lucide-react";

// The exact caption styles from your reference video
const CAPTION_STYLES = [
  { id: "bold-stroke", name: "Bold Stroke", previewText: "AT DAWN", styleClass: "font-black tracking-tighter text-white" },
  { id: "red-highlight", name: "Red Highlight", previewText: "I FOUND", styleClass: "font-bold text-white bg-red-600 px-2 py-0.5 rounded-sm" },
  { id: "sleek", name: "Sleek", previewText: "BEHIND THE", styleClass: "font-light tracking-widest text-white uppercase" },
  { id: "karaoke", name: "Karaoke", previewText: "ON THE", styleClass: "font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-white" },
  { id: "majestic", name: "Majestic", previewText: "FIRST PAGE", styleClass: "font-serif italic font-bold text-yellow-400" },
  { id: "beast", name: "Beast", previewText: "IT ASKED", styleClass: "font-black text-white uppercase drop-shadow-[0_4px_4px_rgba(0,0,0,1)]" },
  { id: "elegant", name: "Elegant", previewText: "DUSTY", styleClass: "font-serif text-white tracking-wide" },
  { id: "pixel", name: "Pixel", previewText: "OLD TV", styleClass: "font-mono font-bold text-green-400" },
  { id: "clarity", name: "Clarity", previewText: "NOTEBOOK", styleClass: "font-medium text-black bg-white px-3 py-1 rounded-md" }
];

export function CaptionStyleGenerator({ 
  onContinue, 
  onBack 
}: { 
  onContinue: () => void;
  onBack: () => void;
}) {
  const [selectedStyle, setSelectedStyle] = useState("majestic");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2"></h3>
        <p className="text-slate-400 -mt-6">Choose how captions will appear in your video</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl pt-2">
        {CAPTION_STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          
          return (
            <div 
              key={style.id}
              onClick={() => setSelectedStyle(style.id)}
              className="flex flex-col gap-3 cursor-pointer group"
            >
              <div className={`relative w-full h-32 rounded-xl overflow-hidden transition-all duration-300 flex items-center justify-center bg-slate-900 ${
                isSelected 
                  ? 'ring-2 ring-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.15)] scale-[1.02]' 
                  : 'ring-1 ring-slate-800 group-hover:ring-slate-600'
              }`}>
                
                {/* Simulated Caption Look */}
                <div className={`text-xl ${style.styleClass}`}>
                  {style.previewText}
                </div>
                
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-slate-900 rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-purple-500 fill-current" />
                  </div>
                )}
              </div>
              
              <h4 className={`text-sm font-medium text-center transition-colors ${isSelected ? 'text-purple-400' : 'text-slate-300 group-hover:text-white'}`}>
                {style.name}
              </h4>
            </div>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-800">
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