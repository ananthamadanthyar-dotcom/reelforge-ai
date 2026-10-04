import { NextRequest, NextResponse } from "next/server";
import { exec } from "child_process";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seriesName, niche } = body;

    // Generate a high-retention hook based on the niche
    let dynamicScript = `The secret truth about ${seriesName} that nobody wants you to know...`;
    if (niche?.includes("Mythology")) {
      dynamicScript = "Long forgotten by mortals, the ancient gods left a final warning carved in stone...";
    } else if (niche?.includes("Tech")) {
      dynamicScript = "Artificial intelligence just crossed a boundary that changes everything we know about code...";
    }

    const scriptPath = path.join(process.cwd(), "video_generator.py");
    const outputFilename = `reel_${Date.now()}.mp4`;
    const escapedScript = dynamicScript.replace(/"/g, '\\"');

    // Execute python with the dynamic script parameter
    exec(`python "${scriptPath}" "${escapedScript}" "${outputFilename}"`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error}`);
        return;
      }
      console.log(`Python Output: ${stdout}`);
    });

    return NextResponse.json({ 
      success: true, 
      message: `AI script generated & render pipeline started for: ${seriesName}` 
    });

  } catch (error) {
    console.error("Render API error:", error);
    return NextResponse.json({ success: false, error: "Failed to trigger render" }, { status: 500 });
  }
}