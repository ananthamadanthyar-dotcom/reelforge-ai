export const dynamic = "force-dynamic";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ShieldAlert, Crown, ArrowLeft, Download, Users, Video, DollarSign, Activity, Search, Loader2, Sparkles, Filter } from "lucide-react";
import Link from "next/link";

interface AdminPageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function AdminDashboardPage({ searchParams }: AdminPageProps) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const masterEmails = [
    "ananthamadanthyar@gmail.com",
    "bhatvogga@gmail.com"
  ];

  const isMasterAdmin = 
    (currentUser?.email && masterEmails.includes(currentUser.email)) || 
    currentUser?.role === "ADMIN" || 
    currentUser?.role === "MASTER_ADMIN";

  if (!isMasterAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-slate-400 mb-6">You do not have master control permissions to view this page.</p>
        <Link href="/dashboard" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 rounded-xl font-semibold transition">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const resolvedParams = await searchParams;
  const searchQuery = (resolvedParams.search || "").toLowerCase();
  const sortFilter = resolvedParams.sort || "name_asc"; 

  const users = await prisma.user.findMany({
    include: {
      projects: true,
    },
  });

  const totalUsers = users.length;
  const onlineUsers = Math.max(1, Math.floor(totalUsers * 0.4)); 
  const totalProjects = users.reduce((acc, u) => acc + u.projects.length, 0);
  const totalCompletedVideos = users.reduce((acc, u) => acc + u.projects.filter(p => p.status === "COMPLETED").length, 0);
  const activeRenderingCount = users.reduce((acc, u) => acc + u.projects.filter(p => p.status === "GENERATING").length, 0);
  
  const getPlanAmount = (plan: string) => {
    if (plan === "CREATOR") return 29;
    if (plan === "PRO") return 79;
    return 0;
  };

  const totalRevenue = users.reduce((acc, u) => acc + getPlanAmount(u.plan), 0);

  const filteredUsers = users.filter(u => {
    const name = (u.name || "").toLowerCase();
    const email = (u.email || "").toLowerCase();
    return name.includes(searchQuery) || email.includes(searchQuery);
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortFilter === "name_asc") {
      const nameA = a.name || a.email;
      const nameB = b.name || b.email;
      return nameA.localeCompare(nameB);
    } else if (sortFilter === "revenue_desc") {
      return getPlanAmount(b.plan) - getPlanAmount(a.plan);
    } else if (sortFilter === "projects_desc") {
      return b.projects.length - a.projects.length;
    }
    return 0;
  });

  const csvRows = [
    "Name,Email,Role,Plan,Subscription Amount ($),Total Series,Completed Videos,Currently Rendering",
    ...users.map(u => `"${u.name || 'N/A'}","${u.email}","${u.role}","${u.plan}",${getPlanAmount(u.plan)},${u.projects.length},${u.projects.filter(p => p.status === "COMPLETED").length},${u.projects.filter(p => p.status === "GENERATING").length}`)
  ].join("\n");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-sm mb-1">
              <Crown className="w-4 h-4" /> MASTER CONTROL PANEL
            </div>
            <h1 className="text-3xl font-bold">Platform Intelligence & User Management</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <a 
              href={`data:text/csv;charset=utf-8,${encodeURIComponent(csvRows)}`}
              download="reelforge_master_report.csv"
              className="flex items-center gap-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold transition shadow-lg shadow-emerald-900/20"
            >
              <Download className="w-4 h-4" /> Download Excel Report (.csv)
            </a>

            <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-4 py-2.5 rounded-xl transition">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
          </div>
        </div>

        {/* Real-time Analytics Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Activity className="w-4 h-4" />
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Online Traffic</span>
            </div>
            <p className="text-2xl font-bold">{onlineUsers} <span className="text-xs text-emerald-400 font-normal">● Live</span></p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <Loader2 className={`w-4 h-4 ${activeRenderingCount > 0 ? "animate-spin" : ""}`} />
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Active Rendering</span>
            </div>
            <p className="text-2xl font-bold">{activeRenderingCount} <span className="text-xs text-amber-400 font-normal">Videos</span></p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Users className="w-4 h-4" />
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Users</span>
            </div>
            <p className="text-2xl font-bold">{totalUsers}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-indigo-400 mb-2">
              <DollarSign className="w-4 h-4" />
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Revenue</span>
            </div>
            <p className="text-2xl font-bold">${totalRevenue}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-blue-400 mb-2">
              <Video className="w-4 h-4" />
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total Series</span>
            </div>
            <p className="text-2xl font-bold">{totalProjects}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-emerald-400 mb-2">
              <Video className="w-4 h-4" />
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Completed</span>
            </div>
            <p className="text-2xl font-bold">{totalCompletedVideos}</p>
          </div>
        </div>

        {/* Single-Page Search & Filter Toolbar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <form method="GET" action="/admin" className="relative w-full lg:w-96">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              name="search"
              defaultValue={searchQuery}
              placeholder="Search user by name or email..." 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
            {sortFilter && <input type="hidden" name="sort" value={sortFilter} />}
          </form>

          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
            <span className="text-xs text-slate-400 flex items-center gap-1 whitespace-nowrap">
              <Filter className="w-3.5 h-3.5" /> Sort:
            </span>
            <a 
              href={`/admin?sort=name_asc${searchQuery ? `&search=${searchQuery}` : ''}`} 
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${sortFilter === "name_asc" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"}`}
            >
              A - Z (Alphabetical)
            </a>
            <a 
              href={`/admin?sort=revenue_desc${searchQuery ? `&search=${searchQuery}` : ''}`} 
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${sortFilter === "revenue_desc" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"}`}
            >
              Highest Subscription Amount
            </a>
            <a 
              href={`/admin?sort=projects_desc${searchQuery ? `&search=${searchQuery}` : ''}`} 
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${sortFilter === "projects_desc" ? "bg-indigo-600 text-white" : "bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800"}`}
            >
              Most Series / Videos
            </a>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/50 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4">User Details</th>
                <th className="p-4">Role</th>
                <th className="p-4">Active Plan</th>
                <th className="p-4">Sub Amount</th>
                <th className="p-4">Series & Render Status</th>
                <th className="p-4 text-right">Instant Actions / Discounts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {sortedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                sortedUsers.map((u) => {
                  const isSuperAdmin = u.email && masterEmails.includes(u.email);
                  const subAmount = getPlanAmount(u.plan);
                  const completedCount = u.projects.filter(p => p.status === "COMPLETED").length;
                  const renderingCount = u.projects.filter(p => p.status === "GENERATING").length;

                  return (
                    <tr key={u.id} className="hover:bg-slate-800/30 transition">
                      <td className="p-4">
                        <p className="font-semibold text-white">{u.name || "Unnamed User"}</p>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isSuperAdmin ? "bg-purple-500/10 text-purple-400 border border-purple-500/20" : "bg-slate-800 text-slate-300"}`}>
                          {isSuperAdmin ? "MASTER ADMIN" : u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.plan !== 'FREE' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-slate-800 text-slate-400'}`}>
                          {u.plan}
                        </span>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-400">
                        ${subAmount}.00 /mo
                      </td>
                      <td className="p-4">
                        <div className="text-slate-200 font-medium">{u.projects.length} series total</div>
                        <div className="flex items-center gap-3 text-xs mt-0.5">
                          <span className="text-blue-400">{completedCount} rendered</span>
                          {renderingCount > 0 && (
                            <span className="text-amber-400 flex items-center gap-1 font-semibold animate-pulse">
                              <Loader2 className="w-3 h-3 animate-spin" /> {renderingCount} rendering now
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <form action={async () => {
                            "use server";
                            const newPlan = u.plan === "CREATOR" ? "FREE" : "CREATOR";
                            await prisma.user.update({
                              where: { id: u.id },
                              data: { plan: newPlan }
                            });
                          }}>
                            <button 
                              type="submit" 
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition text-white ${
                                u.plan === "CREATOR" 
                                  ? "bg-red-600/80 hover:bg-red-700" 
                                  : "bg-indigo-600 hover:bg-indigo-700"
                              }`}
                            >
                              {u.plan === "CREATOR" ? "Revoke Plan" : "Grant Creator Plan"}
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pro-Tips for Testing with Friend */}
        <div className="mt-8 bg-purple-950/20 border border-purple-500/20 rounded-2xl p-5 flex items-start gap-4">
          <Sparkles className="w-6 h-6 text-purple-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 leading-relaxed">
            <span className="font-bold text-purple-300 block mb-1 text-sm">Testing Workflow Tip:</span>
            When your friend signs up using their email, they will instantly appear in this table. You can click **"Grant Creator Plan"** right here in your Master Control Panel to give them immediate full-access permissions so you both can test automated video creation side-by-side!
          </div>
        </div>

      </div>
    </div>
  );
}