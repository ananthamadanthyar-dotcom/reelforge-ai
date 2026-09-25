"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Film, ArrowRight, Wand2, Gamepad2, Image as ImageIcon } from "lucide-react";

export function VisualsGenerator({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [style, setStyle] = useState("gameplay");

  async function handleGenerate() {
    setLoading(true);
    // Simulate our AI matching background footage to the script
    await new Promise(resolve => setTimeout(resolve, 2500));
    setReady(true);
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        <h3 className="text-lg font-medium text-white mb-4">Choose Background Visuals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button onClick={() => setStyle("gameplay")} className={`p-4 rounded-xl border text-left transition-all ${style === "gameplay" ? "bg-indigo-600/20 border-indigo-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
            <Gamepad2 className={`w-6 h-6 mb-2 ${style === "gameplay" ? "text-indigo-400" : "text-slate-500"}`} />
            <div className="font-medium text-slate-200">Split-Screen</div>
            <div className="text-xs text-slate-500 mt-1">Minecraft, GTA, ASMR</div>
          </button>
          <button onClick={() => setStyle("ai")} className={`p-4 rounded-xl border text-left transition-all ${style === "ai" ? "bg-indigo-600/20 border-indigo-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
            <ImageIcon className={`w-6 h-6 mb-2 ${style === "ai" ? "text-indigo-400" : "text-slate-500"}`} />
            <div className="font-medium text-slate-200">AI Generated</div>
            <div className="text-xs text-slate-500 mt-1">Midjourney style images</div>
          </button>
          <button onClick={() => setStyle("stock")} className={`p-4 rounded-xl border text-left transition-all ${style === "stock" ? "bg-indigo-600/20 border-indigo-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
            <Film className={`w-6 h-6 mb-2 ${style === "stock" ? "text-indigo-400" : "text-slate-500"}`} />
            <div className="font-medium text-slate-200">Cinematic Stock</div>
            <div className="text-xs text-slate-500 mt-1">High-quality real footage</div>
          </button>
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 mt-4 text-base">
          <Wand2 className={`w-5 h-5 mr-2 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? "Matching scenes to script..." : "Generate Visuals (Costs 1 Credit)"}
        </Button>
      </div>

      {ready && (
        <div className="p-6 bg-slate-900 border border-emerald-500/30 rounded-xl space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-emerald-400" /> Visuals Ready
          </h3>
          <p className="text-slate-400 text-sm">We successfully matched 4 background scenes to your script timing.</p>
          
          {/* Simulated preview of generated images/clips */}
          <div className="grid grid-cols-4 gap-2 mt-4">
             {[1,2,3,4].map(i => (
               <div key={i} className="aspect-[9/16] bg-slate-950 border border-slate-800 rounded-md flex items-center justify-center">
                 <Film className="w-6 h-6 text-slate-700" />
               </div>
             ))}
          </div>

          <Button onClick={() => router.push(`/projects/${projectId}?step=audio`)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base mt-6">
            Approve & Continue to Audio <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}