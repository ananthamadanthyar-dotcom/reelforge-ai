import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    const apiKey = process.env.PEXELS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Pexels API key is missing from .env" }, { status: 500 });
    }

    // Call Pexels to search for a vertical HD video
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=1&orientation=portrait`,
      {
        headers: { Authorization: apiKey },
      }
    );

    const data = await response.json();

    if (!response.ok || !data.videos || data.videos.length === 0) {
      return NextResponse.json({ error: "No video found for that query" }, { status: 404 });
    }

    // Find the best HD video link
    const videoFiles = data.videos[0].video_files;
    const hdVideo = videoFiles.find((file: any) => file.quality === 'hd') || videoFiles[0];

    return NextResponse.json({ 
      videoUrl: hdVideo.link,
      thumbnail: data.videos[0].image
    });

  } catch (error) {
    console.error("Pexels API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}