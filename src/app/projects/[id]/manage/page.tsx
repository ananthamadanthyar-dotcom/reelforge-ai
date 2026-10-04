export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { 
  ArrowLeft, Settings, Video, FileText, Play, 
  Clock, Share2, Tv, Camera, Smartphone, Loader2, CheckCircle2, Download, ExternalLink, Code
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Import our new interactive component!
import CreativeSettings from "./CreativeSettings";

const ART_STYLE_PREVIEWS = {
  "Photorealistic": "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=800&auto=format&fit=crop",
  "Anime / Cel Shaded": "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop",
  "Dark Fantasy / Horror": "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=800&auto=format&fit=crop",
  "Cyberpunk 3D": "https://images.unsplash.com/photo-1601168494951-419b48b61c9c?q=80&w=800&auto=format&fit=crop",
  "3D Animation": "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
  "Comic Book": "https://images.unsplash.com/photo-1612036782180-6f0b6ce846ce?q=80&w=800&auto=format&fit=crop"
};

export default async function ManageProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  });

  if (!user) redirect("/login");

  const project = await prisma.project.findUnique({
    where: { 
      id: projectId,
      userId: user.id
    }
  });

  if (!project) redirect("/dashboard");

  const currentArtPreview = ART_STYLE_PREVIEWS[project.artStyle as keyof typeof ART_STYLE_PREVIEWS] || ART_STYLE_PREVIEWS["Photorealistic"];

  // Server Action: We pass this to our Client Component
  const saveCreativeSettings = async (formData: FormData) => {
    "use server";
    await prisma.project.update({
      where: { id: projectId },
      data: {
        voice: formData.get("voice") as string,
        artStyle: formData.get("artStyle") as string,
        captionStyle: formData.get("captionStyle") as string,
      }
    });
    revalidatePath(`/projects/${projectId}/manage`);
  };

  const startGeneration = async () => {
    "use server";
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "GENERATING" }
    });
    revalidatePath(`/projects/${projectId}/manage`);
    revalidatePath("/dashboard"); 
  };

  const simulateCompletion = async () => {
    "use server";
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "COMPLETED" }
    });
    revalidatePath(`/projects/${projectId}/manage`);
    revalidatePath("/dashboard"); 
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-purple-500/30 p-10">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex items-center gap-4 mb-10">
          <a href="/dashboard" className="inline-flex items-center justify-center w-10 h-10 border border-slate-800 bg-slate-900 hover:bg-slate-800 text-white rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Settings className="w-7 h-7 text-purple-500" />
              Series Settings
            </h1>
            <p className="text-slate-400">Manage the configuration for {project.seriesName}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
              <Video className="w-5 h-5 text-indigo-400" />
              <h2 className="text-xl font-bold">General Details</h2>
            </div>
            <div className="space-y-6 flex-1">
              <div>
                <p className="text-sm text-slate-500 mb-1">Series Name</p>
                <p className="text-lg font-medium text-slate-200">{project.seriesName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Status</p>
                {project.status === "GENERATING" ? (
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20 flex items-center w-fit gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" /> Generating
                  </span>
                ) : project.status === "COMPLETED" ? (
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20 flex items-center w-fit gap-2">
                    <CheckCircle2 className="w-3 h-3" /> Render Complete
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                    Active
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Created At</p>
                <p className="font-medium text-slate-200">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* HERE IS OUR NEW COMPONENT IN ACTION */}
          <CreativeSettings 
            initialVoice={project.voice}
            initialArtStyle={project.artStyle}
            initialCaptionStyle={project.captionStyle}
            status={project.status}
            watermarkImage={project.watermarkImage}
            onSave={saveCreativeSettings}
          />
        </div>

        {/* BOTTOM SECTION: Generation Pipeline */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-8">
          
          {project.status === "COMPLETED" ? (
            
            <div className="flex flex-col lg:flex-row gap-10 items-center lg:items-start">
              <div className="w-full max-w-[320px] aspect-[9/16] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden relative group shadow-2xl shadow-blue-900/20 flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-16 h-16 bg-blue-600/90 rounded-full flex items-center justify-center backdrop-blur shadow-lg cursor-pointer hover:bg-blue-500 transition-transform hover:scale-105">
                    <Play className="w-8 h-8 text-white ml-1 fill-current" />
                  </div>
                </div>
                <img src={currentArtPreview} alt="Thumbnail" className="w-full h-full object-cover opacity-60" />
              </div>

              <div className="flex-1 w-full">
                <h2 className="text-3xl font-bold text-white mb-2">The Goddess of Love Was Born From Pure Violence</h2>
                <p className="text-blue-400 font-medium flex items-center gap-2 mb-8">
                  <CheckCircle2 className="w-5 h-5" /> Successfully Generated & Rendered
                </p>

                <div className="mb-8">
                  <a href="https://www.w3schools.com/html/mov_bbb.mp4" download="ReelForge_Final_Video.mp4" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full sm:w-auto h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg">
                      <Download className="w-5 h-5 mr-2" /> Download Final Video (MP4)
                    </Button>
                  </a>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Share2 className="w-5 h-5 text-indigo-400" /> Auto-Posting Status
                  </h3>
                  
                  <div className="space-y-4">
                    {project.youtubeEnabled && (
                      <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="p-2 bg-red-500/10 text-red-400 rounded-md"><Tv className="w-4 h-4" /></span>
                          <span className="font-medium">YouTube Shorts</span>
                        </div>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          View Post <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {project.instagramEnabled && (
                      <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="p-2 bg-pink-500/10 text-pink-400 rounded-md"><Camera className="w-4 h-4" /></span>
                          <span className="font-medium">Instagram Reels</span>
                        </div>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          View Post <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {project.tiktokEnabled && (
                      <div className="flex items-center justify-between p-3 bg-slate-900 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-3">
                          <span className="p-2 bg-cyan-500/10 text-cyan-400 rounded-md"><Smartphone className="w-4 h-4" /></span>
                          <span className="font-medium">TikTok</span>
                        </div>
                        <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1">
                          View Post <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                    {!project.youtubeEnabled && !project.instagramEnabled && !project.tiktokEnabled && (
                      <p className="text-slate-500 text-sm italic">You didn't connect any accounts for auto-posting.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

          ) : project.status === "GENERATING" ? (
            
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                  <Clock className="w-8 h-8" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Generation in Progress</h2>
              <p className="text-slate-400 max-w-md mx-auto mb-8">
                Your AI script is locked in and the video is currently rendering. This process takes up to 24 hours.
              </p>
              
              <div className="flex items-center gap-6 text-sm font-medium mb-10">
                <div className="flex items-center gap-2 text-emerald-400"><CheckCircle2 className="w-5 h-5" /> Script Finalized</div>
                <div className="w-8 h-px bg-slate-700"></div>
                <div className="flex items-center gap-2 text-amber-400"><Loader2 className="w-5 h-5 animate-spin" /> Rendering</div>
              </div>

              <form action={simulateCompletion} className="mt-8 pt-8 border-t border-slate-800/50 w-full max-w-md">
                <p className="text-xs text-slate-500 mb-3 font-mono">DEV MODE: Skip the 24-hour wait</p>
                <Button type="submit" variant="secondary" className="bg-slate-800 hover:bg-slate-700 text-slate-300 w-full">
                  <Code className="w-4 h-4 mr-2" /> Force Render Complete
                </Button>
              </form>
            </div>

          ) : (

            <>
              <div className="flex items-center gap-3 mb-6 border-b border-slate-800 pb-4">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h2 className="text-xl font-bold">Upcoming Video Concept</h2>
              </div>
              
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 mb-8">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20 mb-4 inline-block">
                  Auto-Generated • Ready to Render
                </span>
                <h3 className="text-xl font-bold text-white mb-3">The Goddess of Love Was Born From Pure Violence</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  <strong className="text-slate-300">Hook:</strong> Did you know that in Greek Mythology...
                </p>
              </div>

              <form action={startGeneration}>
                <Button type="submit" className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white text-lg rounded-xl shadow-lg">
                  <Play className="w-6 h-6 mr-3" /> Start 24-Hour Generation
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}