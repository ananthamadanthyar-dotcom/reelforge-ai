"use client";

import { useState } from "react";
import { Palette, Loader2, ArrowRight, PlayCircle, CheckCircle2, Image as ImageIcon } from "lucide-react";

// Reduced to your 7 requested styles
const visualStyles = [
  { id: "comic", name: "Comic", image: "/comic.jpg", fallback: "from-red-500 to-orange-500" },
  { id: "anime", name: "Anime", image: "/anime.jpg", fallback: "from-rose-500 to-pink-500" },
  { id: "mythology", name: "Mythology", image: "/mythology.jpg", fallback: "from-amber-700 to-amber-500" },
  { id: "lego", name: "Lego", image: "/lego.jpg", fallback: "from-yellow-500 to-amber-400" },
  { id: "disney", name: "Disney", image: "/disney.jpg", fallback: "from-pink-400 to-rose-400" },
  { id: "dark-fantasy", name: "Dark Fantasy", image: "/dark-fantasy.jpg", fallback: "from-slate-800 to-slate-600" },
  { id: "realism", name: "Realism", image: "/realism.jpg", fallback: "from-blue-600 to-indigo-600" }
];

const generatedScenes = [
  {
    id: 1,
    type: "Hook",
    duration: "0:00-0:05",
    voiceover: "Did you know that in Greek Mythology, a mortal king once put Death itself in chains?",
    previewUrl: "https://images.pexels.com/photos/3304113/pexels-photo-3304113.jpeg?auto=compress&cs=tinysrgb&w=600", 
  },
  {
    id: 2,
    type: "Context",
    duration: "0:05-0:15",
    voiceover: "Sisyphus didn't just get condemned to roll a boulder for eternity out of nowhere...",
    previewUrl: "https://images.pexels.com/photos/1036856/pexels-photo-1036856.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

export function VisualsGenerator({ projectId, onContinue }: { projectId: string; onContinue?: () => void }) {
  const [selectedStyle, setSelectedStyle] = useState("anime");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleAutoGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 3500));
    setIsGenerating(false);
    setIsCompleted(true);
  };

  return (
    <div className="space-y-8">
      
      <div className="p-6 bg-[#0B0F19] border border-slate-800 rounded-xl space-y-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Palette className="w-5 h-5 text-indigo-500" /> Art Style
          </h3>
          <p className="text-sm text-slate-400">
            Choose the visual style for your video. All styles are displayed below.
          </p>
        </div>

        {!isCompleted && (
          <>
            {/* Grid dynamically scales, landing on exactly 7 columns for large screens */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 pt-2">
              {visualStyles.map((style) => {
                const isSelected = selectedStyle === style.id;
                
                return (
                  <div 
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className="flex flex-col gap-3 cursor-pointer group"
                  >
                    <div className={`relative w-full aspect-[9/16] rounded-2xl overflow-hidden transition-all duration-300 bg-gradient-to-br ${style.fallback} ${
                      isSelected 
                        ? 'ring-4 ring-indigo-600 shadow-xl shadow-indigo-500/20 scale-[1.02]' 
                        : 'ring-1 ring-slate-800 group-hover:ring-slate-600'
                    }`}>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white/30" />
                      </div>

                      <img 
                        src={style.image} 
                        alt={style.name} 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-10 ${isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'}`}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.opacity = '0';
                        }}
                      />
                      
                      {isSelected && (
                        <div className="absolute inset-0 bg-indigo-500/20 z-20 pointer-events-none" />
                      )}
                    </div>
                    
                    <h4 className={`text-sm font-medium text-center transition-colors ${isSelected ? 'text-indigo-400' : 'text-slate-300 group-hover:text-white'}`}>
                      {style.name}
                    </h4>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-800">
              <button className="px-6 py-2.5 text-slate-400 hover:text-white font-medium text-sm transition-colors">
                ← Back
              </button>
              
              <button
                onClick={handleAutoGenerate}
                disabled={isGenerating}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg shadow-indigo-500/25"
              >
                {isGenerating ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                ) : (
                  <>Continue <ArrowRight className="w-4 h-4 ml-2" /></>
                )}
              </button>
            </div>
          </>
        )}
      </div>

      {isCompleted && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          <div className="flex items-center gap-2 text-emerald-400 font-medium px-2">
            <CheckCircle2 className="w-5 h-5" />
            {visualStyles.find(s => s.id === selectedStyle)?.name} Visuals successfully generated & synced
          </div>

          <div className="space-y-4">
            {generatedScenes.map((scene, index) => (
              <div key={scene.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row gap-5 items-center">
                
                <div className="relative w-full sm:w-48 h-32 bg-slate-950 rounded-lg overflow-hidden border border-slate-700 shrink-0 group">
                  <img 
                    src={scene.previewUrl} 
                    alt={`Scene ${index + 1}`}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="w-8 h-8 text-white/70 shadow-lg drop-shadow-md" />
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <h4 className="font-semibold text-white text-sm mb-2 flex items-center justify-between">
                    <span>Scene {index + 1}: {scene.type}</span>
                    <span className="text-xs font-normal text-slate-500 bg-slate-950 px-2 py-1 rounded">Auto-Synced</span>
                  </h4>
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                    <p className="text-sm text-slate-400 font-mono italic">
                      "{scene.voiceover}"
                    </p>
                  </div>
                </div>
                
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={onContinue}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-emerald-500/25 flex items-center"
            >
              Approve Visuals & Continue <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}