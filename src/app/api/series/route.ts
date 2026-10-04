import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET(request: NextRequest) {
  try {
    const series = await prisma.series.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, series });
  } catch (error) {
    console.error("Error fetching series:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch series" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, niche, frequency } = body;

    if (!name || !niche || !frequency) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    // Ensure a fallback default user exists in the database to satisfy foreign key constraints
    let defaultUser = await prisma.user.findUnique({
      where: { id: "default_user_id" }
    });

    if (!defaultUser) {
      defaultUser = await prisma.user.create({
        data: {
          id: "default_user_id",
          email: "creator@reelforge.ai",
          name: "Default Creator"
        }
      });
    }

    const newSeries = await prisma.series.create({
      data: {
        name,
        niche,
        frequency,
        status: "Active",
        userId: defaultUser.id,
      },
    });

    return NextResponse.json({ success: true, series: newSeries });
  } catch (error) {
    console.error("Error creating series:", error);
    return NextResponse.json({ success: false, error: "Failed to create series" }, { status: 500 });
  }
}