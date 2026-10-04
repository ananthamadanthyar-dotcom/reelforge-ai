import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

// Initialize Resend with your API key from .env (e.g., RESEND_API_KEY=re_123456)
const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  try {
    // Optional: Secure your cron endpoint with a secret key header
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 1. Gather all platform metrics
    const users = await prisma.user.include({ projects: true } as any) || await prisma.user.findMany({ include: { projects: true } });
    const totalUsers = users.length;
    const totalProjects = users.reduce((acc: number, u: any) => acc + u.projects.length, 0);
    const totalCompletedVideos = users.reduce((acc: number, u: any) => acc + u.projects.filter((p: any) => p.status === "COMPLETED").length, 0);
    const activeRenderingCount = users.reduce((acc: number, u: any) => acc + u.projects.filter((p: any) => p.status === "GENERATING").length, 0);

    const getPlanAmount = (plan: string) => {
      if (plan === "CREATOR") return 29;
      if (plan === "PRO") return 79;
      return 0;
    };

    const totalRevenue = users.reduce((acc: number, u: any) => acc + getPlanAmount(u.plan), 0);

    // 2. Compose the HTML Email Report
    const emailHtml = `
      <div style="font-family: sans-serif; background-color: #030712; color: #f8fafc; padding: 30px; border-radius: 16px;">
        <h2 style="color: #a855f7; margin-top: 0;">📊 ReelForge AI - End of Day Report</h2>
        <p style="color: #94a3b8; font-size: 14px;">Here is your automated performance summary for today:</p>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
          <div style="background: #0f172a; padding: 15px; border-radius: 12px; border: 1px solid #1e293b;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Total Users</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #ffffff;">${totalUsers}</p>
          </div>
          <div style="background: #0f172a; padding: 15px; border-radius: 12px; border: 1px solid #1e293b;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Estimated Revenue</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #34d399;">$${totalRevenue}.00</p>
          </div>
          <div style="background: #0f172a; padding: 15px; border-radius: 12px; border: 1px solid #1e293b;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Completed Videos</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #60a5fa;">${totalCompletedVideos}</p>
          </div>
          <div style="background: #0f172a; padding: 15px; border-radius: 12px; border: 1px solid #1e293b;">
            <p style="margin: 0; color: #94a3b8; font-size: 12px; text-transform: uppercase;">Active Renders</p>
            <p style="margin: 5px 0 0 0; font-size: 24px; font-weight: bold; color: #fbbf24;">${activeRenderingCount}</p>
          </div>
        </div>
        
        <p style="color: #64748b; font-size: 11px; margin-top: 30px; border-top: 1px solid #1e293b; pt: 15px;">
          Generated automatically by ReelForge AI Master Control System.
        </p>
      </div>
    `;

    // 3. Send the email to the admin
    await resend.emails.send({
      from: "ReelForge Reports <reports@reelforge.ai>",
      to: ["ananthamadanthyar@gmail.com", "bhatvogga@gmail.com"],
      subject: `Daily Platform Report - $${totalRevenue} Revenue | ${totalCompletedVideos} Videos`,
      html: emailHtml,
    });

    return NextResponse.json({ success: true, message: "Daily report email sent successfully!" });
  } catch (error) {
    console.error("Failed to send daily report email:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}