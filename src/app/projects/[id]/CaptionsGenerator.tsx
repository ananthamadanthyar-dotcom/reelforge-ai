"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Type, Download, PlayCircle, Loader2, CheckCircle2 } from "lucide-react";

export function CaptionsGenerator({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [style, setStyle] = useState("hormozi");

  async function handleRender() {
    setLoading(true);
    // Simulate the final FFmpeg rendering process taking some time
    await new Promise(resolve => setTimeout(resolve, 4000));
    setReady(true);
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      {/* 1. Caption Selection */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        <h3 className="text-lg font-medium text-white mb-4">Choose Caption Style</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => setStyle("hormozi")} className={`p-4 rounded-xl border text-center transition-all ${style === "hormozi" ? "bg-indigo-600/20 border-indigo-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
            <div className="text-xl font-black italic tracking-tighter text-yellow-400 mb-2 drop-shadow-md">VIRAL</div>
            <div className="text-xs text-slate-500 mt-1">Bold, colored words (Hormozi style)</div>
          </button>
          
          <button onClick={() => setStyle("minimal")} className={`p-4 rounded-xl border text-center transition-all ${style === "minimal" ? "bg-indigo-600/20 border-indigo-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
            <div className="text-lg font-medium text-white mb-2 font-serif">Minimal</div>
            <div className="text-xs text-slate-500 mt-1">Clean, cinematic subtitles</div>
          </button>

          <button onClick={() => setStyle("gaming")} className={`p-4 rounded-xl border text-center transition-all ${style === "gaming" ? "bg-indigo-600/20 border-indigo-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
            <div className="text-lg font-bold text-green-400 mb-2 font-mono uppercase">Pixel</div>
            <div className="text-xs text-slate-500 mt-1">Fun, bouncy gaming text</div>
          </button>
        </div>

        <Button onClick={handleRender} disabled={loading || ready} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 mt-4 text-base">
          {loading ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <PlayCircle className="w-5 h-5 mr-2" />}
          {loading ? "Rendering Final Video (This takes a moment)..." : "Render Final Video (Costs 2 Credits)"}
        </Button>
      </div>

      {/* 2. Final Output Success State */}
      {ready && (
        <div className="p-6 bg-slate-900 border border-emerald-500/30 rounded-xl shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col md:flex-row gap-8 items-center">
          
          {/* Fake Video Player Preview */}
          <div className="w-48 aspect-[9/16] bg-slate-950 border-2 border-slate-800 rounded-lg relative overflow-hidden flex-shrink-0 group">
             <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 to-slate-900/90 flex flex-col items-center justify-center p-4 text-center">
                <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform mb-4" />
                <span className={`text-xl font-black italic tracking-tighter drop-shadow-md ${style === 'hormozi' ? 'text-yellow-400' : 'text-white'}`}>
                  AWESOME!
                </span>
             </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center justify-center md:justify-start gap-2 mb-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" /> Video Rendered!
              </h3>
              <p className="text-slate-400">Your video is ready to be published to TikTok, Reels, or Shorts.</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-6">
                <Download className="w-5 h-5 mr-2" /> Download MP4
              </Button>
              <Button variant="outline" onClick={() => router.push("/dashboard")} className="border-slate-700 bg-transparent text-white h-12 px-6 hover:bg-slate-800">
                Back to Dashboard
              </Button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}