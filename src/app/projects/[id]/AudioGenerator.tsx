"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Mic, ArrowRight, Wand2, Volume2, PlayCircle } from "lucide-react";

export function AudioGenerator({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [voice, setVoice] = useState("adam");

  async function handleGenerate() {
    setLoading(true);
    // Simulate our AI hitting the ElevenLabs / OpenAI TTS API
    await new Promise(resolve => setTimeout(resolve, 2500));
    setReady(true);
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        <h3 className="text-lg font-medium text-white mb-4">Choose AI Voice</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Voice 1 */}
          <button onClick={() => setVoice("adam")} className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${voice === "adam" ? "bg-indigo-600/20 border-indigo-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
            <div>
              <div className="font-medium text-slate-200">Marcus (Deep & Trustworthy)</div>
              <div className="text-xs text-slate-500 mt-1">Great for documentaries and facts</div>
            </div>
            <PlayCircle className={`w-6 h-6 ${voice === "adam" ? "text-indigo-400" : "text-slate-600"}`} />
          </button>
          
          {/* Voice 2 */}
          <button onClick={() => setVoice("sarah")} className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${voice === "sarah" ? "bg-indigo-600/20 border-indigo-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
            <div>
              <div className="font-medium text-slate-200">Sarah (Energetic & Fun)</div>
              <div className="text-xs text-slate-500 mt-1">Perfect for fast-paced TikToks</div>
            </div>
            <PlayCircle className={`w-6 h-6 ${voice === "sarah" ? "text-indigo-400" : "text-slate-600"}`} />
          </button>

          {/* Voice 3 */}
          <button onClick={() => setVoice("jordan")} className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${voice === "jordan" ? "bg-indigo-600/20 border-indigo-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
            <div>
              <div className="font-medium text-slate-200">Jordan (Storyteller)</div>
              <div className="text-xs text-slate-500 mt-1">Captivating and suspenseful</div>
            </div>
            <PlayCircle className={`w-6 h-6 ${voice === "jordan" ? "text-indigo-400" : "text-slate-600"}`} />
          </button>

          {/* Voice 4 */}
          <button onClick={() => setVoice("echo")} className={`p-4 rounded-xl border text-left transition-all flex items-center justify-between ${voice === "echo" ? "bg-indigo-600/20 border-indigo-500" : "bg-slate-950 border-slate-800 hover:border-slate-700"}`}>
            <div>
              <div className="font-medium text-slate-200">Echo (Cinematic Trailer)</div>
              <div className="text-xs text-slate-500 mt-1">Epic and massive scale</div>
            </div>
            <PlayCircle className={`w-6 h-6 ${voice === "echo" ? "text-indigo-400" : "text-slate-600"}`} />
          </button>
        </div>

        <Button onClick={handleGenerate} disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 mt-4 text-base">
          <Wand2 className={`w-5 h-5 mr-2 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? "Synthesizing voiceover..." : "Generate Audio (Costs 1 Credit)"}
        </Button>
      </div>

      {ready && (
        <div className="p-6 bg-slate-900 border border-emerald-500/30 rounded-xl space-y-4 shadow-[0_0_30px_rgba(16,185,129,0.1)]">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-emerald-400" /> Audio Ready
          </h3>
          <p className="text-slate-400 text-sm">Your script has been successfully converted into high-quality audio.</p>
          
          {/* Simulated Audio Player */}
          <div className="h-16 bg-slate-950 border border-slate-800 rounded-lg flex items-center px-4 gap-4 mt-4">
            <button className="text-indigo-400 hover:text-indigo-300">
              <PlayCircle className="w-8 h-8" />
            </button>
            {/* Fake waveform */}
            <div className="flex-1 flex items-center gap-1 h-8 opacity-50">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="flex-1 bg-slate-500 rounded-full" style={{ height: `${Math.max(20, Math.random() * 100)}%` }}></div>
              ))}
            </div>
            <span className="text-xs text-slate-500 font-mono">0:42</span>
          </div>

          <Button onClick={() => router.push(`/projects/${projectId}?step=captions`)} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base mt-6">
            Approve & Continue to Captions <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}