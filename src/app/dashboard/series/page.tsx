"use client";

import { useState, useEffect } from "react";
import { Plus, Sparkles, Trash2, Play, Settings, RefreshCw } from "lucide-react";

interface Series {
  id: string;
  name: string;
  niche: string;
  frequency: string;
  status: "Active" | "Paused" | "Rendering";
}

export default function SeriesManagementPage() {
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newNiche, setNewNiche] = useState("Ancient Mythology & Legends");
  const [newFreq, setNewFreq] = useState("Daily");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const res = await fetch("/api/series");
      const data = await res.json();
      if (data.success) {
        setSeriesList(data.series);
      }
    } catch (err) {
      console.error("Failed to load series:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateSeries = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const res = await fetch("/api/series", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newTitle, niche: newNiche, frequency: newFreq })
      });
      const data = await res.json();
      if (data.success) {
        setSeriesList([data.series, ...seriesList]);
        setNewTitle("");
        setIsCreating(false);
      } else {
        alert("Failed to save series to database.");
      }
    } catch (err) {
      console.error("Error creating series:", err);
      alert("Error saving series.");
    }
  };

  const handleDelete = (id: string) => {
    setSeriesList(seriesList.filter(s => s.id !== id));
  };

  const handleTriggerRender = async (series: Series) => {
    try {
      setLoadingId(series.id);
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seriesName: series.name, niche: series.niche })
      });
      
      const data = await res.json();
      if (data.success) {
        alert(`Success! AI script generated & render started for "${series.name}". Check your terminal and root folder for the MP4.`);
      } else {
        alert("Failed to trigger render.");
      }
    } catch (err) {
      console.error(err);
      alert("Error communicating with the render server.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans py-10 px-6">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Series Management</h1>
            <p className="text-slate-400 text-sm">Configure and monitor your automated faceless content pipelines.</p>
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-[#a855f7] hover:bg-[#9333ea] text-white px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" /> Create New Series
          </button>
        </div>

        {/* Create Series Modal Form */}
        {isCreating && (
          <div className="bg-[#0f172a] border border-[#a855f7]/40 rounded-2xl p-6 mb-8 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#a855f7]" /> Setup a New Video Series
            </h2>
            <form onSubmit={handleCreateSeries} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Series Name</label>
                <input 
                  type="text" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., Untold History Secrets" 
                  className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#a855f7]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Content Niche</label>
                  <select 
                    value={newNiche}
                    onChange={(e) => setNewNiche(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#a855f7]"
                  >
                    <option value="Ancient Mythology & Legends">Ancient Mythology & Legends</option>
                    <option value="Dark Mysteries & Thrillers">Dark Mysteries & Thrillers</option>
                    <option value="Artificial Intelligence Updates">Artificial Intelligence Updates</option>
                    <option value="Stoic Motivation">Stoic Motivation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1 uppercase tracking-wider">Posting Frequency</label>
                  <select 
                    value={newFreq}
                    onChange={(e) => setNewFreq(e.target.value)}
                    className="w-full bg-[#030712] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#a855f7]"
                  >
                    <option value="Daily">Daily (1x/day)</option>
                    <option value="3 times per week">3 times per week</option>
                    <option value="2 times per day">Pro (2x/day)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-[#a855f7] hover:bg-[#9333ea] text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Save & Launch Series
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Series List Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading your series from database...</div>
        ) : seriesList.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-sm bg-[#0f172a]/50 rounded-2xl border border-slate-800">
            No active series found. Create your first automated series above!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seriesList.map((series) => (
              <div 
                key={series.id}
                className="bg-[#0f172a] border border-slate-800/60 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 text-[#a855f7] border border-purple-500/20">
                      {series.status}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400">
                      <button className="p-2 hover:text-white transition-colors" title="Settings">
                        <Settings className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(series.id)}
                        className="p-2 hover:text-red-400 transition-colors" 
                        title="Delete Series"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-1">{series.name}</h3>
                  <p className="text-xs text-slate-400 mb-4">{series.niche}</p>

                  <div className="bg-[#030712] rounded-xl p-3 border border-slate-800/80 mb-6 flex items-center justify-between text-xs text-slate-300">
                    <span className="text-slate-500">Schedule:</span>
                    <span className="font-semibold text-white">{series.frequency}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleTriggerRender(series)}
                    disabled={loadingId === series.id}
                    className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingId === series.id ? "animate-spin" : ""}`} /> 
                    {loadingId === series.id ? "Rendering..." : "Trigger Render"}
                  </button>
                  <button className="p-2 bg-purple-500/20 hover:bg-purple-500/30 text-[#a855f7] rounded-xl transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}