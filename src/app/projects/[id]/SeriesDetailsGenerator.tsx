"use client";

import { useState } from "react";
import { Upload, X, Crown, CheckCircle2, Loader2, Type, Image as ImageIcon, Slash, Lock, Share2, Tv, Camera, Smartphone } from "lucide-react";
import { finalizeProject } from "@/app/actions/project";

interface SeriesDetailsProps {
  projectId: string;
  onBack: () => void;
  onFinish?: () => void;
  userPlan?: string;
}

export function SeriesDetailsGenerator({ projectId, onBack, userPlan = "HOBBY" }: SeriesDetailsProps) {
  const [seriesName, setSeriesName] = useState("");
  
  // Social Media states
  const [youtubeEnabled, setYoutubeEnabled] = useState(true);
  const [instagramEnabled, setInstagramEnabled] = useState(true);
  const [tiktokEnabled, setTiktokEnabled] = useState(false);

  // Watermark states
  const [watermarkType, setWatermarkType] = useState<"logo" | "text" | "none">("logo");
  const [textWatermark, setTextWatermark] = useState("");
  const [logoImage, setLogoImage] = useState<string | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);

  const hasTextWatermarkAccess = ["HOBBY", "DAILY", "PRO", "ADMIN"].includes(userPlan.toUpperCase());

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setLogoImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleComplete = async () => {
    setIsSaving(true);
    
    const finalWatermarkImage = watermarkType === "logo" ? logoImage : null;
    const finalWatermarkText = (watermarkType === "text" && hasTextWatermarkAccess) ? textWatermark : null;

    await finalizeProject(
      projectId, 
      seriesName || "Untitled Series", 
      finalWatermarkImage,
      finalWatermarkText
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-slate-900/50 border border-slate-800 rounded-3xl p-10 text-slate-50 relative">
      
      {/* STEP 6 OF 6 BADGE */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold px-3 py-1 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20">
          Step 6 of 6
        </span>
      </div>

      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">Final touches</h2>
        <p className="text-slate-400">Name your series, connect auto-posting accounts, and configure your watermark.</p>
      </div>

      <div className="space-y-8">
        
        {/* 1. SERIES NAME */}
        <div>
          <label className="text-sm font-medium text-slate-300 block mb-2">Series Name</label>
          <input
            type="text"
            value={seriesName}
            onChange={(e) => setSeriesName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-4 px-4 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
            placeholder="e.g., Midnight Mysteries"
          />
        </div>

        {/* 2. SOCIAL MEDIA ACCOUNTS TOGGLES */}
        <div className="p-6 border border-slate-800 bg-slate-950/50 rounded-2xl">
          <h3 className="text-sm font-medium text-slate-300 mb-4 flex items-center gap-2">
            <Share2 className="w-4 h-4 text-indigo-400" /> Auto-Posting Destinations
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setYoutubeEnabled(!youtubeEnabled)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                youtubeEnabled ? "bg-red-500/10 border-red-500/40 text-white" : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-red-400" />
                <span className="text-xs font-medium">YouTube</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${youtubeEnabled ? "bg-red-500" : "bg-slate-700"}`}></div>
            </button>

            <button
              type="button"
              onClick={() => setInstagramEnabled(!instagramEnabled)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                instagramEnabled ? "bg-pink-500/10 border-pink-500/40 text-white" : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-pink-400" />
                <span className="text-xs font-medium">Instagram</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${instagramEnabled ? "bg-pink-500" : "bg-slate-700"}`}></div>
            </button>

            <button
              type="button"
              onClick={() => setTiktokEnabled(!tiktokEnabled)}
              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                tiktokEnabled ? "bg-cyan-500/10 border-cyan-500/40 text-white" : "bg-slate-900 border-slate-800 text-slate-500"
              }`}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-medium">TikTok</span>
              </div>
              <div className={`w-3 h-3 rounded-full ${tiktokEnabled ? "bg-cyan-500" : "bg-slate-700"}`}></div>
            </button>
          </div>
        </div>

        {/* 3. WATERMARK SECTION */}
        <div className="p-6 border border-slate-800 bg-slate-950/50 rounded-2xl relative">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <p className="text-sm font-medium text-slate-300">Watermark Type</p>
            
            <div className="flex bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <button 
                type="button"
                onClick={() => setWatermarkType("none")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium transition-colors ${watermarkType === "none" ? "bg-slate-700 text-white" : "text-slate-400 hover:bg-slate-800"}`}
              >
                <Slash className="w-3 h-3" /> None
              </button>
              
              <button 
                type="button"
                onClick={() => {
                  if (hasTextWatermarkAccess) setWatermarkType("text");
                }}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-l border-slate-800 transition-colors relative ${watermarkType === "text" ? "bg-purple-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
              >
                <Type className="w-3 h-3" /> Text 
                {!hasTextWatermarkAccess && <Lock className="w-3 h-3 ml-1 text-amber-400" />}
              </button>

              <button 
                type="button"
                onClick={() => setWatermarkType("logo")}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-medium border-l border-slate-800 transition-colors ${watermarkType === "logo" ? "bg-purple-600 text-white" : "text-slate-400 hover:bg-slate-800"}`}
              >
                <ImageIcon className="w-3 h-3" /> Logo <Crown className="w-3 h-3 ml-1 text-yellow-400" />
              </button>
            </div>
          </div>
          
          {watermarkType === "none" && (
            <div className="py-8 text-center text-slate-500 text-sm">
              Your videos will be generated without any watermark.
            </div>
          )}

          {watermarkType === "text" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              {hasTextWatermarkAccess ? (
                <>
                  <label className="text-xs text-slate-400 block mb-2">Watermark Text (e.g., @YourHandle)</label>
                  <input
                    type="text"
                    value={textWatermark}
                    onChange={(e) => setTextWatermark(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
                    placeholder="@FacelessReels"
                  />
                </>
              ) : (
                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-amber-300 text-sm">
                  <span>Text watermark requires an upgraded plan.</span>
                  <a href="/dashboard/billing" className="underline font-bold text-xs uppercase tracking-wider">Upgrade</a>
                </div>
              )}
            </div>
          )}

          {watermarkType === "logo" && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              {logoImage ? (
                <div className="relative w-full h-40 rounded-xl border border-slate-700 bg-slate-900 flex items-center justify-center overflow-hidden group">
                  <img src={logoImage} alt="Logo Preview" className="max-w-full max-h-full object-contain p-4" />
                  <button 
                    type="button"
                    onClick={() => setLogoImage(null)}
                    className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full backdrop-blur transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="relative w-full border-2 border-dashed border-slate-700 hover:border-purple-500 bg-slate-900/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                  <input 
                    type="file" 
                    accept="image/png, image/jpeg" 
                    onChange={handleLogoUpload}
                    className="hidden" 
                  />
                  <Upload className="w-8 h-8 mb-3 text-slate-500 group-hover:text-purple-400 transition-colors" />
                  <p className="text-sm text-slate-300 font-medium mb-1">
                    Click to upload transparent logo
                  </p>
                  <p className="text-xs text-slate-500">PNG or JPG (Max 5MB)</p>
                </label>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-12 pt-6 border-t border-slate-800">
        <button 
          type="button"
          onClick={onBack}
          className="px-6 py-3 text-slate-400 hover:text-white font-medium transition-colors"
        >
          Back
        </button>
        
        <button 
          type="button"
          onClick={handleComplete} 
          disabled={isSaving}
          className="flex items-center bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full px-8 py-3 shadow-lg shadow-purple-900/20 transition-all disabled:opacity-70"
        >
          {isSaving ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Complete Setup
            </>
          )}
        </button>
      </div>
    </div>
  );
}