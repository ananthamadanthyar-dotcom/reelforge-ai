import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Fallback text just in case, but it will use whatever the frontend sends
    const scriptText = body.script || "This is a fallback script if nothing was provided.";

    // Simulate AI transcription processing time
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Dynamically split the actual script into words
    const words = scriptText.split(" ").filter((w: string) => w.length > 0);
    let currentTime = 0;

    // Mathematically generate timestamps for every single word
    const dynamicCaptions = words.map((word: string) => {
      const seconds = Math.floor(currentTime);
      const milliseconds = Math.floor((currentTime - seconds) * 100);
      
      // Format as 00:00.XX
      const timeString = `00:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
      
      currentTime += 0.4; // Assume each word takes roughly 400ms to say

      return {
        time: timeString,
        text: word
      };
    });

    return NextResponse.json({ captions: dynamicCaptions });

  } catch (error) {
    console.error("Caption API Error:", error);
    return NextResponse.json({ error: "Failed to generate captions" }, { status: 500 });
  }
}