"use client";

import { useState } from "react";
import { Calendar, Edit, Trash2, X, Play } from "lucide-react";

// Mock data to simulate the saved scripts from your database
const initialVideos = [
  {
    id: "1",
    title: "This King Captured Death and Broke the Universe",
    script: "Hook: Did you know that in Greek Mythology, a mortal king once put Death itself in chains? Sisyphus didn't just get condemned to roll a boulder for eternity out of nowhere...",
    scheduledAt: "Sep 30 at 19:30",
  },
  {
    id: "2",
    title: "Apollo Gave Her a Gift and The...",
    script: "Hook: Apollo fell in love, but it cost her everything...",
    scheduledAt: "Oct 2 at 19:30",
  },
];

export function ScheduleDashboard() {
  const [videos, setVideos] = useState(initialVideos);
  const [editingVideo, setEditingVideo] = useState<any>(null);

  // Opens the edit modal
  const openEditModal = (video: any) => setEditingVideo(video);
  
  // Closes the edit modal
  const closeEditModal = () => setEditingVideo(null);

  // Saves the changes made in the modal
  const saveChanges = () => {
    setVideos(videos.map(v => v.id === editingVideo.id ? editingVideo : v));
    closeEditModal();
  };

  return (
    <div className="space-y-6 w-full text-slate-200">
      
      {/* Header Section */}
      <div className="flex items-center space-x-4 mb-6">
        <button className="flex items-center px-4 py-2 bg-slate-800 rounded-lg text-sm font-medium hover:bg-slate-700 transition">
          <Play className="w-4 h-4 mr-2" /> Videos
        </button>
        <button className="flex items-center px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium">
          <Calendar className="w-4 h-4 mr-2" /> Calendar
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-1">Upcoming Schedule</h2>
        <p className="text-sm text-slate-400 mb-4">Drag and drop to reorder your upcoming videos</p>
      </div>

      {/* Horizontal Scrollable Queue */}
      <div className="flex overflow-x-auto space-x-4 pb-4 snap-x">
        {videos.map((video) => (
          <div key={video.id} className="min-w-[300px] bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col justify-between snap-start">
            <div>
              <h3 className="font-semibold text-white line-clamp-1 mb-3">{video.title}</h3>
              <span className="inline-flex items-center px-3 py-1 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-full border border-purple-500/20">
                <Calendar className="w-3 h-3 mr-2" />
                {video.scheduledAt}
              </span>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6 border-t border-slate-800 pt-3">
              <button onClick={() => openEditModal(video)} className="text-slate-400 hover:text-white transition">
                <Edit className="w-4 h-4" />
              </button>
              <button className="text-slate-400 hover:text-red-400 transition">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        
        {/* Empty State Card[cite: 8] */}
        <div className="min-w-[300px] border-2 border-dashed border-slate-700 rounded-xl p-4 flex items-center justify-center text-slate-500 text-sm snap-start">
          More videos will be generated soon
        </div>
      </div>

      {/* Edit Video Concept Modal[cite: 9] */}
      {editingVideo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            
            <div className="flex justify-between items-center p-6 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">Edit video concept</h2>
                <p className="text-sm text-slate-400">Make changes to your video concept.</p>
              </div>
              <button onClick={closeEditModal} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                <input 
                  type="text" 
                  value={editingVideo.title}
                  onChange={(e) => setEditingVideo({...editingVideo, title: e.target.value})}
                  className="w-full bg-slate-950 border border-purple-500/50 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea 
                  value={editingVideo.script}
                  onChange={(e) => setEditingVideo({...editingVideo, script: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-700 text-white rounded-lg p-3 min-h-[150px] resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-end space-x-3 bg-slate-900/50">
              <button onClick={closeEditModal} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 transition">
                Cancel
              </button>
              <button onClick={saveChanges} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition shadow-lg shadow-purple-500/25">
                Save changes
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}