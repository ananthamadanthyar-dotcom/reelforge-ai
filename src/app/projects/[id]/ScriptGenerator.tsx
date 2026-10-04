"use client";

import { useState } from "react";
import { Loader2, Wand2, Calendar, Edit, Lock, X, CheckCircle2, ArrowRight } from "lucide-react";

// NEW: Added onContinue prop so the parent layout can pass down the tab-switching function
export function ScriptGenerator({ projectId, onContinue }: { projectId: string; onContinue?: () => void }) {
  const [promptTopic, setPromptTopic] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [videos, setVideos] = useState<any[]>([]);
  const [editingVideo, setEditingVideo] = useState<any>(null);
  const [hasHitLimit, setHasHitLimit] = useState(false);

  const isAdmin = true; 

  const handleGenerateScript = async () => {
    if (!promptTopic) return alert("Please enter a topic first!");
    
    if (videos.length >= 3 && !isAdmin) {
      setHasHitLimit(true);
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: promptTopic }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to generate script");

      const newBatch = data.concepts.map((concept: any, index: number) => {
        const date = new Date();
        date.setDate(date.getDate() + index + 1);
        return {
          id: Date.now().toString() + "-" + index,
          title: concept.title,
          script: concept.script,
          caption: concept.caption,
          scheduledAt: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          status: "DRAFT" 
        };
      });

      setVideos((prev) => [...newBatch, ...prev]);
      setPromptTopic(""); 

    } catch (error) {
      console.error(error);
      alert("Failed to generate scripts. Check terminal logs.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApproveScript = (id: string) => {
    setVideos(videos.map(v => v.id === id ? { ...v, status: "APPROVED" } : v));
  };

  const closeEditModal = () => setEditingVideo(null);
  
  const saveChanges = () => {
    setVideos(videos.map(v => v.id === editingVideo.id ? editingVideo : v));
    closeEditModal();
  };

  return (
    <div className="space-y-8">
      {/* 1. Generator Section */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden">
        {hasHitLimit && (
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-6 text-center">
            <Lock className="w-12 h-12 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Series Limit Reached</h3>
            <p className="text-slate-300 text-sm max-w-md mb-6">Your current plan limits you to 3 videos per series.</p>
            <div className="flex gap-4">
              <button onClick={() => setHasHitLimit(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white transition">Dismiss</button>
              <a href="https://reelforge-ai.lemonsqueezy.com/checkout/buy/d5d15010-8454-4a6a-afe3-86137ec928f3" target="_blank" rel="noreferrer" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition">Upgrade to Daily</a>
            </div>
          </div>
        )}

        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-indigo-400" /> 1. Generate Campaign
        </h3>
        <p className="text-sm text-slate-400 mb-4">What topic should we create a 3-part series about?</p>
        <textarea
          placeholder="e.g. The history of Mangalore..."
          value={promptTopic}
          onChange={(e) => setPromptTopic(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg p-3 mb-4 min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
        />
        <button
          onClick={handleGenerateScript}
          disabled={isGenerating || !promptTopic}
          className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white h-12 rounded-lg text-base font-medium flex items-center justify-center transition-colors"
        >
          {isGenerating ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Writing scripts & captions...</> : "Generate 3-Part Series"}
        </button>
      </div>

      {/* 2. Concept Queue Section */}
      {videos.length > 0 && (
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white mb-1">Concept Queue</h2>
            <p className="text-sm text-slate-400">Review your generated scripts and approve them to move to the Visuals step.</p>
          </div>

          <div className="flex flex-col space-y-4">
            {videos.map((video) => (
              <div key={video.id} className="bg-slate-950 border border-slate-700 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-2">{video.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-3 py-1 bg-slate-800 text-slate-300 text-xs font-medium rounded-full border border-slate-700">
                      <Calendar className="w-3 h-3 mr-2" /> Schedule: {video.scheduledAt}
                    </span>
                    
                    {video.status === "DRAFT" ? (
                      <span className="inline-flex items-center px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-full border border-amber-500/20">
                        Needs Approval
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Script Approved
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button 
                    onClick={() => setEditingVideo(video)}
                    className="px-4 py-2 border border-slate-700 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition"
                  >
                    <Edit className="w-4 h-4 inline-block mr-2" /> Edit Script
                  </button>
                  
                  {video.status === "DRAFT" ? (
                    <button 
                      onClick={() => handleApproveScript(video.id)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-emerald-500/25 flex items-center"
                    >
                      <CheckCircle2 className="w-4 h-4 inline-block mr-2" /> Approve Script
                    </button>
                  ) : (
                    // FIXED: Added onClick={onContinue} here
                    <button 
                      onClick={onContinue}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-indigo-500/25 flex items-center"
                    >
                      Continue to Visuals <ArrowRight className="w-4 h-4 inline-block ml-2" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Edit Modal */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Edit Video Concept</h2>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input type="text" value={editingVideo.title} onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Video Script (Used for AI Voiceover & Scenes)</label>
                <textarea value={editingVideo.script} onChange={(e) => setEditingVideo({...editingVideo, script: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 min-h-[200px] font-mono text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Social Media Caption (For TikTok/Instagram)</label>
                <textarea value={editingVideo.caption || ""} onChange={(e) => setEditingVideo({...editingVideo, caption: e.target.value})} className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 min-h-[100px] text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end space-x-3 bg-slate-900/50">
              <button onClick={closeEditModal} className="px-4 py-2 text-slate-300 hover:bg-slate-800 rounded-lg transition font-medium">Cancel</button>
              <button onClick={saveChanges} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition font-medium">Save changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}