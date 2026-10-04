"use client";

import { useState, useTransition } from "react";
import { Palette, AlertCircle, Mic, Image as ImageIcon, Type, Save, Loader2, Lock, Sliders, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

const ART_STYLE_PREVIEWS = {
  "Photorealistic": "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=800&auto=format&fit=crop",
  "Anime / Cel Shaded": "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
  "Dark Fantasy / Horror": "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop",
  "Cyberpunk 3D": "https://images.unsplash.com/photo-1601168494951-419b48b61c9c?q=80&w=800&auto=format&fit=crop",
  "3D Animation": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
  "Comic Book": "https://images.unsplash.com/photo-1612036782180-6f0b6ce846ce?q=80&w=800&auto=format&fit=crop"
};

export default function CreativeSettings({ 
  initialVoice, 
  initialArtStyle, 
  initialCaptionStyle, 
  status, 
  watermarkImage, 
  onSave 
}: any) {
  // Existing Settings
  const [artStyle, setArtStyle] = useState(initialArtStyle || "Photorealistic");
  const [voice, setVoice] = useState(initialVoice || "Adam (Deep & Cinematic)");
  const [captionStyle, setCaptionStyle] = useState(initialCaptionStyle || "Bold Yellow (Hormozi Style)");
  
  // NEW: Watermark Settings (Defaulting to your strict specs)
  const [wmOpacity, setWmOpacity] = useState(40);
  const [wmSize, setWmSize] = useState("medium");
  const [wmPosition, setWmPosition] = useState("bottom");
  
  const [editsRemaining, setEditsRemaining] = useState(99);
  const [isPending, startTransition] = useTransition();

  const currentArtPreview = ART_STYLE_PREVIEWS[artStyle as keyof typeof ART_STYLE_PREVIEWS] || ART_STYLE_PREVIEWS["Photorealistic"];
  const isDisabled = status !== "ACTIVE" || editsRemaining === 0;

  const handleSave = () => {
    if (editsRemaining <= 0) return;
    
    const formData = new FormData();
    formData.append("voice", voice);
    formData.append("artStyle", artStyle);
    formData.append("captionStyle", captionStyle);
    formData.append("wmOpacity", wmOpacity.toString());
    formData.append("wmSize", wmSize);
    formData.append("wmPosition", wmPosition);
    
    startTransition(() => {
      onSave(formData);
      setEditsRemaining((prev: number) => prev - 1);
    });
  };

  // Helper for live sizing
  const getLogoSizeClass = () => {
    if (wmSize === "small") return "w-12";
    if (wmSize === "large") return "w-28";
    return "w-20"; // medium default
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 lg:col-span-2">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <Palette className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-bold text-white">Creative Configuration</h2>
        </div>
        
        <div className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${editsRemaining > 0 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
          <AlertCircle className="w-3 h-3" /> 
          {editsRemaining} Edits Remaining
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side: The Settings Form */}
        <div className="flex-1 flex flex-col">
          <div className="space-y-6 flex-1 mb-8">
            
            {/* Core Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Mic className="w-4 h-4 text-slate-400" /> AI Voiceover
                </label>
                <select value={voice} onChange={(e) => setVoice(e.target.value)} disabled={isDisabled} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-purple-500 appearance-none disabled:opacity-50">
                  <option value="Adam (Deep & Cinematic)">Adam (Deep & Cinematic)</option>
                  <option value="Sarah (Energetic & Bright)">Sarah (Energetic & Bright)</option>
                  <option value="Marcus (Authoritative News)">Marcus (Authoritative News)</option>
                  <option value="Chloe (Soft & Mysterious)">Chloe (Soft & Mysterious)</option>
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <ImageIcon className="w-4 h-4 text-slate-400" /> Visual Art Style
                </label>
                <select value={artStyle} onChange={(e) => setArtStyle(e.target.value)} disabled={isDisabled} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-purple-500 appearance-none disabled:opacity-50">
                  <option value="Photorealistic">Photorealistic</option>
                  <option value="Anime / Cel Shaded">Anime / Cel Shaded</option>
                  <option value="Dark Fantasy / Horror">Dark Fantasy / Horror</option>
                  <option value="Cyberpunk 3D">Cyberpunk 3D</option>
                  <option value="3D Animation">3D Animation</option>
                  <option value="Comic Book">Comic Book</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                <Type className="w-4 h-4 text-slate-400" /> Caption Typography
              </label>
              <select value={captionStyle} onChange={(e) => setCaptionStyle(e.target.value)} disabled={isDisabled} className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-purple-500 appearance-none disabled:opacity-50">
                <option value="Bold Yellow (Hormozi Style)">Bold Yellow (Hormozi Style)</option>
                <option value="Minimalist White (Cinematic)">Minimalist White (Cinematic)</option>
                <option value="Dynamic Glitch (Gaming)">Dynamic Glitch (Gaming)</option>
              </select>
            </div>

            {/* NEW: Watermark Specific Settings */}
            <div className="pt-6 border-t border-slate-800/50">
              <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-400" /> Watermark Overlay Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center justify-between text-sm font-medium text-slate-400 mb-2">
                    <span>Opacity throughout video</span>
                    <span className="text-blue-400">{wmOpacity}%</span>
                  </label>
                  <input 
                    type="range" min="10" max="100" step="5"
                    value={wmOpacity} onChange={(e) => setWmOpacity(Number(e.target.value))}
                    disabled={isDisabled}
                    className="w-full accent-blue-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-2">
                    Size Format
                  </label>
                  <div className="flex bg-slate-950 border border-slate-800 rounded-lg overflow-hidden disabled:opacity-50">
                    <button type="button" onClick={() => setWmSize("small")} disabled={isDisabled} className={`flex-1 py-2 text-xs font-medium ${wmSize === "small" ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}>Small</button>
                    <button type="button" onClick={() => setWmSize("medium")} disabled={isDisabled} className={`flex-1 py-2 text-xs font-medium border-x border-slate-800 ${wmSize === "medium" ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}>Medium</button>
                    <button type="button" onClick={() => setWmSize("large")} disabled={isDisabled} className={`flex-1 py-2 text-xs font-medium ${wmSize === "large" ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-900'}`}>Large</button>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800">
            <Button onClick={handleSave} disabled={isDisabled || isPending} className={`w-full text-white rounded-full px-6 ${editsRemaining === 0 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-slate-800 hover:bg-slate-700'}`}>
              {isPending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving Configuration...</>
              ) : editsRemaining === 0 ? (
                <><Lock className="w-4 h-4 mr-2" /> Edits Locked</>
              ) : (
                <><Save className="w-4 h-4 mr-2" /> Lock in Design & Watermark</>
              )}
            </Button>
          </div>
        </div>

        {/* Right Side: LIVE 9:16 Video Preview */}
        <div className="w-full md:w-64 flex-shrink-0 bg-slate-950/50 p-4 rounded-2xl border border-slate-800 h-fit flex flex-col items-center">
          <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider text-center flex items-center gap-1.5">
            <Image className="w-3 h-3" /> Live 9:16 Preview
          </p>
          
          {/* 9:16 Canvas Simulator */}
          <div className="w-full aspect-[9/16] rounded-xl overflow-hidden border border-slate-700 shadow-2xl relative bg-black">
            
            {/* Background Art */}
            <img src={currentArtPreview} alt="Art Style" className="w-full h-full object-cover opacity-80 transition-opacity duration-500" />
            
            {/* Fake TikTok/Reels UI Overlay (To show context) */}
            <div className="absolute right-2 bottom-20 flex flex-col gap-3 opacity-60">
              <div className="w-8 h-8 bg-white/20 rounded-full backdrop-blur"></div>
              <div className="w-8 h-8 bg-white/20 rounded-full backdrop-blur"></div>
              <div className="w-8 h-8 bg-white/20 rounded-full backdrop-blur"></div>
            </div>
            
            {/* LIVE WATERMARK OVERLAY - Placed at exact 80% bottom mark */}
            {watermarkImage && (
              <div 
                className="absolute left-1/2 -translate-x-1/2 transition-all duration-300 ease-in-out flex flex-col items-center pointer-events-none"
                style={{ 
                  bottom: '15%', // Approx 80% down the screen
                  opacity: wmOpacity / 100 
                }}
              >
                <img 
                  src={watermarkImage} 
                  alt="Watermark" 
                  className={`${getLogoSizeClass()} object-contain drop-shadow-lg transition-all duration-300`} 
                />
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-4 text-center px-2">
            Watermark is rendered on every frame at {wmOpacity}% opacity to protect your content.
          </p>
        </div>

      </div>
    </div>
  );
}