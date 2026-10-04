import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { script } = await req.json();

    if (!script) {
      return NextResponse.json({ error: "Script text is required" }, { status: 400 });
    }

    // DEVELOPMENT BYPASS: 
    // Since ElevenLabs blocks API access on the Free Tier, this bypass returns 
    // a valid dummy Base64 audio string (silence) so you can test your frontend UI.
    
    const dummyAudioBase64 = "SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//MUxAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq";

    return NextResponse.json({ 
      success: true, 
      message: "Audio generated successfully (DEVELOPER BYPASS).",
      audioBase64: `data:audio/mp3;base64,${dummyAudioBase64}`
    });

  } catch (error: any) {
    console.error("Audio Generation Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate audio" }, { status: 500 });
  }
}