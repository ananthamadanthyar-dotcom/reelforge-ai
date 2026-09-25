import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Play, Sparkles } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <header className="container mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          ReelForge AI
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
          <Link href="/features" className="hover:text-white transition">Features</Link>
          <Link href="/templates" className="hover:text-white transition">Templates</Link>
          <Link href="/pricing" className="hover:text-white transition">Pricing</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-white">Login</Link>
          <Link href="/signup" className={cn(buttonVariants(), "bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6")}>
            Get Started
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm text-slate-300 mb-8">
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          ReelForge 1.0 is now live
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-tight">
          Create Faceless Videos at <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Scale With AI</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12">
          Generate scripts, voiceovers, visuals, captions, and complete short-form videos from a single idea. Turn your concepts into viral content automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <Link 
            href="/signup" 
            className={cn(buttonVariants({ size: "lg" }), "bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-14 px-8 text-lg w-full sm:w-auto")}
          >
            Create Your First Video Free
          </Link>
          <Link 
            href="/demo" 
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full h-14 px-8 text-lg w-full sm:w-auto border-slate-700 bg-transparent hover:bg-slate-900 hover:text-white")}
          >
            <Play className="w-5 h-5 mr-2" /> Watch Demo
          </Link>
        </div>

        <div className="relative mx-auto max-w-5xl rounded-xl border border-slate-800 bg-slate-900/50 p-2 shadow-2xl backdrop-blur">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 rounded-xl" />
          <div className="rounded-lg overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center relative">
             <div className="absolute inset-0 flex">
                <div className="w-64 border-r border-slate-800 p-4 hidden md:block">
                  <div className="h-8 w-3/4 bg-slate-800 rounded mb-6"></div>
                  <div className="space-y-3">
                    {[1,2,3,4].map(i => <div key={i} className="h-4 bg-slate-800/50 rounded w-full"></div>)}
                  </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="w-[300px] h-[533px] bg-slate-900 border border-slate-800 rounded-lg shadow-xl flex items-center justify-center">
                    <Play className="w-12 h-12 text-slate-700" />
                  </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}