import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Film, Music, Type, CheckCircle2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ScriptGenerator } from "./ScriptGenerator";
import { VisualsGenerator } from "./VisualsGenerator";
import { AudioGenerator } from "./AudioGenerator";
import { CaptionsGenerator } from "./CaptionsGenerator"; // <-- Imported final step!

const prisma = new PrismaClient();

export default async function ProjectCreatorPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ step?: string }>
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { id } = await params;
  const { step } = await searchParams;
  const currentStep = step || "script"; 

  const project = await prisma.project.findUnique({
    where: { id: id, userId: session.user.id }
  });

  if (!project) redirect("/dashboard");

  const getStepClass = (stepId: string) => {
    if (currentStep === stepId) {
      return "px-3 py-2 bg-indigo-500/10 text-indigo-400 rounded-lg font-medium text-sm flex items-center gap-3 border border-indigo-500/20";
    }
    return "px-3 py-2 text-slate-500 font-medium text-sm flex items-center gap-3";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
      <header className="h-14 flex items-center justify-between px-4 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-slate-400 hover:text-white")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Dashboard
          </Link>
          <div className="h-4 w-px bg-slate-800"></div>
          <span className="text-sm font-medium text-slate-300">{project.title}</span> 
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="border-slate-700 bg-transparent text-slate-300">Save Draft</Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-64 border-r border-slate-800 bg-slate-900/50 p-4 hidden md:block">
          <nav className="space-y-1">
            <div className={getStepClass("script")}>
              {currentStep === "visuals" || currentStep === "audio" || currentStep === "captions" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Sparkles className="w-4 h-4" />} 
              01. Idea & Script
            </div>
            <div className={getStepClass("visuals")}>
              {currentStep === "audio" || currentStep === "captions" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Film className="w-4 h-4" />} 
              02. Visuals & Scenes
            </div>
            <div className={getStepClass("audio")}>
              {currentStep === "captions" ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Music className="w-4 h-4" />} 
              03. Voice & Audio
            </div>
            <div className={getStepClass("captions")}>
              <Type className="w-4 h-4" /> 04. Captions
            </div>
          </nav>
        </aside>

        <main className="flex-1 overflow-y-auto p-6 md:p-12">
          <div className="max-w-2xl mx-auto space-y-8">
            
            {currentStep === "script" && (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white">What is your video about?</h2>
                  <p className="text-slate-400 text-sm">Enter a topic and our AI will generate a complete script.</p>
                </div>
                <ScriptGenerator projectId={project.id} />
              </>
            )}

            {currentStep === "visuals" && (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white">Background Visuals</h2>
                  <p className="text-slate-400 text-sm">Select the visual style for your video.</p>
                </div>
                <VisualsGenerator projectId={project.id} />
              </>
            )}

            {currentStep === "audio" && (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white">Voiceover & Audio</h2>
                  <p className="text-slate-400 text-sm">Select a professional AI voice to narrate your video.</p>
                </div>
                <AudioGenerator projectId={project.id} />
              </>
            )}

            {/* STEP 4 CONTROLS */}
            {currentStep === "captions" && (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-2 text-white">Captions & Final Output</h2>
                  <p className="text-slate-400 text-sm">Pick your subtitle style and render your final masterpiece.</p>
                </div>
                <CaptionsGenerator projectId={project.id} />
              </>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}