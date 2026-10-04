export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Sparkles, Video, CreditCard, LogOut, Plus, Clock, Settings, Loader2, CheckCircle2, Play, Layers, Lock, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { deleteProject } from "@/app/actions/project";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const userProjects = await prisma.project.findMany({
    where: {
      userId: user.id,
      status: {
        not: "DRAFT" 
      }
    },
    orderBy: { createdAt: "desc" }
  });

  // Strict check: Change this to evaluate whether the user has purchased a subscription plan (e.g., user.isSubscribed or checking subscription table)
  const hasActiveSubscription = false; // Set to false by default for new users until they buy a plan
  const allowedSeriesCount = hasActiveSubscription ? 1 : 0; 
  const activeSeriesCount = userProjects.length;
  
  const canCreateMore = hasActiveSubscription && activeSeriesCount < allowedSeriesCount;

  const createProject = async () => {
    "use server";
    
    const actionSession = await auth();
    if (!actionSession?.user?.email) redirect("/login");

    const actionUser = await prisma.user.findUnique({
      where: { email: actionSession.user.email }
    });

    if (!actionUser?.id) return;

    // STRICT GATING: If user has no active subscription, redirect them to the pricing page immediately
    if (!hasActiveSubscription) {
      redirect("/pricing");
    }

    const currentProjects = await prisma.project.count({
      where: { 
        userId: actionUser.id, 
        status: { not: "DRAFT" } 
      }
    });

    if (currentProjects >= allowedSeriesCount) {
      redirect("/pricing");
    }

    const newProject = await prisma.project.create({
      data: {
        userId: actionUser.id,
        seriesName: "Untitled Series", 
        status: "DRAFT",
      }
    });

    redirect(`/projects/${newProject.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          ReelForge
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium">
            <Layers className="w-4 h-4 text-purple-400" />
            {activeSeriesCount} / {allowedSeriesCount} Series Unlocked
          </div>
          <div className="text-sm text-slate-400">
            {session.user.email}
          </div>
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}>
            <button type="submit" className="text-slate-400 hover:text-white transition">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name || 'Creator'}</h1>
            <p className="text-slate-400">Manage your subscription and automated video series.</p>
          </div>
          
          {hasActiveSubscription && canCreateMore ? (
            <form action={createProject}>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 h-12 shadow-lg shadow-indigo-900/20">
                <Plus className="w-5 h-5 mr-2" />
                Create New Series
              </Button>
            </form>
          ) : (
            <a href="/pricing">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6 h-12 shadow-lg shadow-purple-900/20">
                <Lock className="w-5 h-5 mr-2" />
                Buy Plan to Unlock Series
              </Button>
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Layers className="w-24 h-24" />
            </div>
            <div className="flex items-center gap-4 mb-4 text-purple-400">
              <Layers className="w-6 h-6" />
              <h3 className="font-medium text-slate-300">Series Slots</h3>
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold">{activeSeriesCount}</p>
              <p className="text-xl text-slate-500 font-medium">/ {allowedSeriesCount}</p>
            </div>
            <p className="text-xs text-slate-500 mt-4 pt-4 border-t border-slate-800">
              Paid plan required to unlock series slots.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4 text-emerald-400">
                <Video className="w-6 h-6" />
                <h3 className="font-medium text-slate-300">Videos Generated</h3>
              </div>
              <p className="text-4xl font-bold">{userProjects.filter(p => p.status === "COMPLETED").length}</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-4 text-cyan-400">
                <CreditCard className="w-6 h-6" />
                <h3 className="font-medium text-slate-300">Subscription Status</h3>
              </div>
              <p className="text-3xl font-bold tracking-tight">{hasActiveSubscription ? "Active" : "No Plan"}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-800">
              <a href="/pricing" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                {hasActiveSubscription ? "Manage Subscription →" : "Buy Plan Now →"}
              </a>
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-6">Active Series</h2>
        
        {userProjects.length === 0 ? (
          <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/30 flex flex-col items-center justify-center">
            <Layers className="w-12 h-12 text-slate-600 mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No series running</h3>
            <p className="text-slate-500 mb-6 max-w-sm">
              You must purchase a subscription plan before you can create or configure an automated series.
            </p>
            <a href="/pricing">
              <Button variant="outline" className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-full">
                <Lock className="w-4 h-4 mr-2" />
                Buy Plan to Unlock Series
              </Button>
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userProjects.map((project) => (
              <div key={project.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col hover:border-indigo-500/50 transition-colors">
                
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400">
                    <Video className="w-6 h-6" />
                  </div>
                  
                  {project.status === "GENERATING" ? (
                    <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full border border-amber-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                      <Loader2 className="w-3 h-3 animate-spin" /> Rendering
                    </span>
                  ) : project.status === "COMPLETED" ? (
                    <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20 flex items-center gap-1.5 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                      <CheckCircle2 className="w-3 h-3" /> Ready
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-500/20">
                      Active
                    </span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-1 truncate">
                  {project.seriesName}
                </h3>
                
                <p className="text-sm text-slate-400 mb-6 flex items-center gap-1">
                  <Clock className="w-4 h-4" /> 
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </p>
                
                <div className="mt-auto pt-4 border-t border-slate-800 flex items-center gap-2">
                  <a href={`/projects/${project.id}/manage`} className="flex-1">
                    <Button className={`w-full text-white ${project.status === "COMPLETED" ? "bg-blue-600 hover:bg-blue-700" : "bg-indigo-600 hover:bg-indigo-700"}`}>
                      {project.status === "COMPLETED" ? (
                        <><Play className="w-4 h-4 mr-2 fill-current" /> View Video</>
                      ) : (
                        <><Settings className="w-4 h-4 mr-2" /> Manage Series</>
                      )}
                    </Button>
                  </a>

                  <form action={async () => {
                    "use server";
                    await deleteProject(project.id);
                  }}>
                    <button 
                      type="submit"
                      className="h-10 w-10 flex items-center justify-center bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 rounded-xl transition-colors"
                      title="Delete Series"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </form>
                </div>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}