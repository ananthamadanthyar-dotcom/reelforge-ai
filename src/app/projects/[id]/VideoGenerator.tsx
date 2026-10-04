"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, Lock, Play, CheckCircle2, Film, Image as ImageIcon, Sparkles } from "lucide-react";
import Link from "next/link";

export function VideoGenerator({ projectId }: { projectId: string }) {
  const router = useRouter();
  
  // In production, you would fetch the user's actual subscription tier from your database
  const [isPremiumUser, setIsPremiumUser] = useState(false); 
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  
  const [rendering, setRendering] = useState(false);
  const [renderComplete, setRenderComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  // Simulating the background render queue
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (rendering && progress < 100) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 99) {
            clearInterval(interval);
            setRendering(false);
            setRenderComplete(true);
            return 100;
          }
          return prev + 1;
        });
      }, 150); // Speed up for testing; in reality, this tracks your 2-hour queue
    }
    return () => clearInterval(interval);
  }, [rendering, progress]);

  function handleStartRender() {
    setRendering(true);
    setRenderComplete(false);
    setProgress(0);
  }

  return (
    <div className="space-y-8">
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-6">
        
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="w-5 h-5 text-indigo-400" /> Final Assembly
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Your script, visuals, and audio are locked in. Configure your final render settings below.
          </p>
        </div>

        {/* Custom Watermark Upsell Section */}
        <div className={`p-5 rounded-xl border-2 transition-all ${watermarkEnabled ? 'bg-indigo-500/10 border-indigo-500' : 'bg-slate-950 border-slate-800'}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-white font-semibold">Custom Brand Watermark</h4>
                {!isPremiumUser && (
                  <span className="bg-amber-500/10 text-amber-500 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Premium
                  </span>
                )}
              </div>
              <p className="text-slate-400 text-sm">
                Replace the default ReelForge AI watermark with your own logo to build your brand.
              </p>
            </div>
            
            <div className="relative inline-flex items-center cursor-pointer mt-1">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={watermarkEnabled}
                onChange={() => {
                  if (isPremiumUser) setWatermarkEnabled(!watermarkEnabled);
                }}
              />
              <div className={`w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${watermarkEnabled ? 'bg-indigo-500' : ''}`}></div>
              
              {/* Click interceptor for free users */}
              {!isPremiumUser && (
                <div 
                  className="absolute inset-0 z-10"
                  onClick={() => alert("Please upgrade to the Daily or Pro plan to unlock Custom Watermarks!")}
                ></div>
              )}
            </div>
          </div>

          {/* Expanded Upload UI (Only shows if they have access AND toggled it on) */}
          {watermarkEnabled && isPremiumUser && (
            <div className="mt-5 pt-5 border-t border-indigo-500/20">
              <div className="border-2 border-dashed border-indigo-500/30 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-indigo-500/5 hover:bg-indigo-500/10 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-indigo-400 mb-3" />
                <p className="text-sm text-slate-200 font-medium mb-1">Click to upload your logo</p>
                <p className="text-xs text-slate-500">PNG with transparent background (Max 2MB)</p>
              </div>
            </div>
          )}

          {/* Upsell Banner (Only shows to free users) */}
          {!isPremiumUser && (
            <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <p className="text-sm text-slate-300">Remove our branding and add your own.</p>
              </div>
              <Link href="/dashboard/billing">
                <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                  Upgrade Plan
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Developer Toggle */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
          <span>Dev Test: Toggle Premium Status</span>
          <button onClick={() => setIsPremiumUser(!isPremiumUser)} className="underline hover:text-white">
            {isPremiumUser ? "Demote to Hobby" : "Upgrade to Pro"}
          </button>
        </div>

        <Button 
          onClick={handleStartRender} 
          disabled={rendering || renderComplete} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-14 mt-8 text-lg font-medium shadow-lg shadow-emerald-900/20"
        >
          {rendering ? (
            "Adding to Render Queue..."
          ) : renderComplete ? (
            <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Video Queued</span>
          ) : (
            <span className="flex items-center gap-2"><Play className="w-5 h-5" /> Start Video Render</span>
          )}
        </Button>

        {/* Progress UI */}
        {rendering && (
          <div className="space-y-2 mt-6 animate-in fade-in duration-300">
            <div className="flex justify-between text-sm">
              <span className="text-indigo-400 font-medium">Assembling components...</span>
              <span className="text-slate-400">{progress}%</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-indigo-500 transition-all duration-200 ease-linear" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-500 text-center mt-2">
              You can close this tab. The video will appear in your dashboard when finished.
            </p>
          </div>
        )}

        {/* Success State */}
        {renderComplete && (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-xl mt-6 text-center animate-in zoom-in-95 duration-500">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-white font-bold mb-1">Render Successfully Queued!</h4>
            <p className="text-sm text-slate-400 mb-6">
              Your video is being generated in the cloud. We will email you when it is ready.
            </p>
            <Link href="/dashboard">
              <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
                Return to Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}