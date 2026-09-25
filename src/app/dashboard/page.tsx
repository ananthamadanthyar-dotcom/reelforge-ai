import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Sparkles, Zap, Video, CreditCard, LogOut, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PrismaClient } from "@prisma/client";
import { createProject } from "@/app/actions/project"; // <-- Imported Server Action

const prisma = new PrismaClient();

export default async function DashboardPage() {
  // 1. Get the logged-in user session
  const session = await auth();

  // 2. If they are not logged in, kick them back to login
  if (!session?.user?.email) {
    redirect("/login");
  }

  // 3. Fetch their credits from the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { creditBalance: true },
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      {/* Top Navbar */}
      <header className="h-16 flex items-center justify-between px-6 border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          ReelForge
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium">
            <Zap className="w-4 h-4 text-yellow-500" />
            {user?.creditBalance?.amount || 0} Credits
          </div>
          <div className="text-sm text-slate-400">
            {session.user.email}
          </div>
          {/* Sign Out Button (Server Action) */}
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

      {/* Main Dashboard Content */}
      <main className="container mx-auto px-6 py-12 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Creator'}</h1>
            <p className="text-slate-400">Here is what is happening with your account today.</p>
          </div>
          
          {/* UPDATED: Top "Create New Video" Button hooked to Server Action */}
          <form action={createProject}>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6 h-12 shadow-lg shadow-indigo-900/20">
              <Plus className="w-5 h-5 mr-2" />
              Create New Video
            </Button>
          </form>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-4 mb-4 text-indigo-400">
              <Zap className="w-6 h-6" />
              <h3 className="font-medium text-slate-300">Available Credits</h3>
            </div>
            <p className="text-4xl font-bold">{user?.creditBalance?.amount || 0}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-4 mb-4 text-emerald-400">
              <Video className="w-6 h-6" />
              <h3 className="font-medium text-slate-300">Videos Generated</h3>
            </div>
            <p className="text-4xl font-bold">0</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-4 mb-4 text-cyan-400">
              <CreditCard className="w-6 h-6" />
              <h3 className="font-medium text-slate-300">Current Plan</h3>
            </div>
            <p className="text-3xl font-bold uppercase tracking-tight">{session.user.plan}</p>
          </div>
        </div>

        {/* Projects Area */}
        <h2 className="text-xl font-bold mb-6">Recent Projects</h2>
        <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/30 flex flex-col items-center justify-center">
          <Video className="w-12 h-12 text-slate-600 mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No videos yet</h3>
          <p className="text-slate-500 mb-6 max-w-sm">
            You haven't generated any videos yet. Click the button below to turn your first idea into reality.
          </p>
          
          {/* UPDATED: Bottom "Start First Project" Button hooked to Server Action */}
          <form action={createProject}>
            <Button type="submit" variant="outline" className="border-slate-700 bg-transparent hover:bg-slate-800 text-white rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              Start First Project
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}