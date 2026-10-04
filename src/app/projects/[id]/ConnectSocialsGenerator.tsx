"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, Play, Camera, Music, Type, UploadCloud } from "lucide-react";

export function ConnectSocialsGenerator({ 
  onContinue, 
  onBack 
}: { 
  onContinue: () => void;
  onBack: () => void;
}) {
  const [youtubeEnabled, setYoutubeEnabled] = useState(true);
  const [instagramEnabled, setInstagramEnabled] = useState(true);
  const [tiktokEnabled, setTiktokEnabled] = useState(true);
  const [watermarkText, setWatermarkText] = useState("");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <p className="text-slate-400 -mt-6">Connect social accounts and set up your video branding.</p>

      <div className="max-w-2xl pt-2 space-y-6">
        
        {/* Social Accounts Section */}
        <div className="space-y-4">
          {/* YouTube Account Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-slate-700">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setYoutubeEnabled(!youtubeEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${youtubeEnabled ? 'bg-purple-600' : 'bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${youtubeEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              
              <div className="flex items-center gap-2">
                <Play className="w-6 h-6 text-red-500" />
                <span className="font-medium text-slate-200">YouTube</span>
                <span className="text-slate-400 text-sm ml-1">FlashWorld</span>
              </div>
            </div>
          </div>

          {/* Instagram Account Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-slate-700">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setInstagramEnabled(!instagramEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${instagramEnabled ? 'bg-purple-600' : 'bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${instagramEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-pink-500" />
                <span className="font-medium text-slate-200">Instagram</span>
                <span className="text-slate-400 text-sm ml-1">info_world_60</span>
              </div>
            </div>
          </div>

          {/* TikTok Account Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900 transition-all hover:border-slate-700">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setTiktokEnabled(!tiktokEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${tiktokEnabled ? 'bg-purple-600' : 'bg-slate-700'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${tiktokEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-cyan-400" />
                <span className="font-medium text-slate-200">TikTok</span>
                <span className="text-slate-400 text-sm ml-1">viral_shorts_daily</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Watermark Section */}
        <div className="pt-6 border-t border-slate-800/50 mt-4">
          <div className="mb-4">
            <h4 className="text-white font-bold mb-1">Video Watermark</h4>
            <p className="text-sm text-slate-400">Protect your content and build brand awareness on social media.</p>
          </div>

          <div className="space-y-4">
            {/* Text Watermark Input */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Text Watermark</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Type className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. @viral_shorts_daily"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
                />
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="text-sm font-medium text-slate-300 mb-2 block">Or Upload Brand Logo</label>
              <div className="w-full h-28 border-2 border-dashed border-slate-700 hover:border-purple-500 transition-colors rounded-xl bg-slate-900 flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-purple-400">
                <UploadCloud className="w-6 h-6 mb-2" />
                <p className="text-sm font-medium">Click to upload transparent logo</p>
                <p className="text-xs text-slate-500 mt-1">PNG format, max 2MB</p>
              </div>
            </div>
          </div>
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