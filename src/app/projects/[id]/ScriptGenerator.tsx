"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateScript } from "@/app/actions/generate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wand2, ArrowRight, Sparkles } from "lucide-react";

export function ScriptGenerator({ projectId }: { projectId: string }) {
  const router = useRouter(); // <-- Added the router!
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [script, setScript] = useState("");

  async function handleGenerate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setScript("");

    const formData = new FormData(e.currentTarget);
    const result = await generateScript(projectId, formData);

    if (result.error) {
      setError(result.error);
    } else if (result.script) {
      setScript(result.script);
    }
    setLoading(false);
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleGenerate} className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        {error && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">{error}</div>}
        
        <div className="space-y-3">
          <Label htmlFor="topic" className="text-slate-300">Video Topic or Idea</Label>
          <Input id="topic" name="topic" required placeholder="e.g. 5 amazing facts about space" className="bg-slate-950 border-slate-700 h-12 text-base" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="text-slate-300">Target Duration</Label>
            <select name="duration" className="flex h-10 w-full items-center justify-between rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="30">~30 Seconds</option>
              <option value="60">~60 Seconds</option>
              <option value="90">~90 Seconds</option>
            </select>
          </div>
          <div className="space-y-3">
            <Label className="text-slate-300">Vibe / Tone</Label>
            <select name="tone" className="flex h-10 w-full items-center justify-between rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="energetic">Energetic & Fast</option>
              <option value="educational">Educational & Calm</option>
              <option value="storytelling">Storytelling</option>
              <option value="scary">Mysterious / Dark</option>
            </select>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white h-12 mt-4 text-base">
          <Wand2 className={`w-5 h-5 mr-2 ${loading ? 'animate-pulse' : ''}`} />
          {loading ? "Generating (Simulating AI)..." : "Generate Script (Costs 1 Credit)"}
        </Button>
      </form>

      {script && (
        <div className="p-6 bg-slate-900 border border-indigo-500/30 rounded-xl space-y-4 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" /> Generated Script
          </h3>
          <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg whitespace-pre-wrap text-slate-300 font-mono text-sm leading-relaxed">
            {script}
          </div>
          
          {/* UPDATED: Hooked up the click event to switch to the visuals step! */}
          <Button 
            onClick={() => router.push(`/projects/${projectId}?step=visuals`)}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-base mt-4"
          >
            Approve & Continue to Visuals <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}