"use client";

import { useState } from "react";
import { ArrowRight, Sparkles, Settings2 } from "lucide-react";

const NICHES = [
  {
    title: "Scary stories",
    description: "Scary stories that give you goosebumps",
    nichePrompt: "Storytelling format. Short horror stories focusing on suspense, unexpected twists, and eerie atmospheres. Avoid excessive gore. Focus on psychological thrills.",
    script: "He found a backpack on a park bench. Inside was twenty thousand dollars in cash...\n\nHe could have walked away. No one would have known. Instead, he sat there for three hours waiting for someone to come back."
  },
  {
    title: "History",
    description: "Viral videos about History spanning from ancient times to modern day.",
    nichePrompt: "Educational storytelling format. Focus on obscure, fascinating historical facts that sound fake but are 100% real. Keep pacing fast and engaging.",
    script: "During World War II, the British military created a top-secret unit made entirely of magicians and illusionists...\n\nTheir mission? To make entire armies disappear."
  },
  {
    title: "Greek Mythology",
    description: "Shocking and dramatic stories from Greek mythology.",
    nichePrompt: "Dramatic storytelling format. Focus on the betrayal, hubris, and extreme punishments found in Greek Myths. Emphasize the petty nature of the gods.",
    script: "Sisyphus didn't just get condemned to roll a boulder for eternity out of nowhere...\n\nHe earned it by committing the most audacious act—putting Death itself in chains."
  },
  {
    title: "True Crime",
    description: "Viral videos about true crime stories.",
    nichePrompt: "Respectful but gripping true crime format. Focus on unsolved mysteries or brilliant detective work. Maintain suspense throughout the script.",
    script: "In 1994, a man walked into a police station to report a stolen car. By the time he walked out, he was the primary suspect in a 20-year-old cold case."
  }
];

export function NicheGenerator({ onContinue }: { onContinue: () => void }) {
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null);
  const [nicheText, setNicheText] = useState("");
  const [scriptText, setScriptText] = useState("");

  const handleSelectPreset = (niche: typeof NICHES[0]) => {
    setSelectedNiche(niche.title);
    setNicheText(niche.nichePrompt);
    setScriptText(niche.script);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <p className="text-slate-400 -mt-6">Select a preset or describe your own niche</p>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-slate-800 pb-2">
        <button 
          onClick={() => setActiveTab("presets")}
          className={`flex items-center gap-2 pb-2 -mb-[9px] border-b-2 font-medium transition-colors ${activeTab === "presets" ? "border-purple-500 text-purple-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}
        >
          <Sparkles className="w-4 h-4" /> Presets
        </button>
        <button 
          onClick={() => setActiveTab("custom")}
          className={`flex items-center gap-2 pb-2 -mb-[9px] border-b-2 font-medium transition-colors ${activeTab === "custom" ? "border-purple-500 text-purple-400" : "border-transparent text-slate-500 hover:text-slate-300"}`}
        >
          <Settings2 className="w-4 h-4" /> Custom
        </button>
      </div>

      {activeTab === "presets" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NICHES.map((niche) => (
            <div 
              key={niche.title}
              onClick={() => handleSelectPreset(niche)}
              className={`p-5 rounded-xl cursor-pointer border transition-all ${
                selectedNiche === niche.title 
                  ? "bg-purple-900/20 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]" 
                  : "bg-slate-900 border-slate-800 hover:border-slate-700"
              }`}
            >
              <h3 className="text-white font-bold mb-1">{niche.title}</h3>
              <p className="text-sm text-slate-400">{niche.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Text Areas */}
      <div className="space-y-6 pt-4">
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">Niche</label>
            <span className="text-xs text-slate-500">{nicheText.length}/5000</span>
          </div>
          <textarea 
            value={nicheText}
            onChange={(e) => setNicheText(e.target.value)}
            placeholder="Describe your topic..."
            className="w-full h-32 bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">Example script <span className="text-slate-500 font-normal ml-2">Optional</span></label>
            <span className="text-xs text-slate-500">{scriptText.length}/2000</span>
          </div>
          <textarea 
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            placeholder="Sets the writing style only. Video topics come from your niche above."
            className="w-full h-40 bg-slate-900 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 focus:outline-none focus:border-purple-500 resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={onContinue}
          disabled={!nicheText}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition flex items-center shadow-lg shadow-purple-500/20"
        >
          Continue <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
}