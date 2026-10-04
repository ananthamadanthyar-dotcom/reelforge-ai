import { NextResponse } from "next/server";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }

    // UPDATED: Now we ask Gemini for 3 keys: title, script, AND caption!
    const prompt = `You are an expert short-form video scriptwriter.
Create 3 DIFFERENT, highly engaging, viral 30-second scripts about the topic: "${topic}".

You MUST respond ONLY with a valid JSON array containing exactly 3 objects. 
Do not include any markdown formatting or text outside the JSON array.
Each object must have exactly three keys: 
1. "title" (a catchy title) 
2. "script" (the full script)
3. "caption" (an engaging social media caption for TikTok/Reels including 3-5 hashtags)

Format the "script" string inside the JSON like this:
[Scene 1: Hook - 0:00-0:05]
(Visual: Fast-paced opening visual hook)
Voiceover: "Punchy opening line..."
[Scene 2: Context - 0:05-0:15]
(Visual: Supporting visual detail)
Voiceover: "The core context or conflict..."
[Scene 3: The Big Reveal - 0:15-0:25]
(Visual: Climax visual)
Voiceover: "The surprising climax or twist..."
[Scene 4: Call to Action - 0:25-0:30]
(Visual: Follow / engagement visual)
Voiceover: "Clear call to action..."`;

    const requestBody = JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }]
    });

    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      let response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`,
        { method: "POST", headers: { "Content-Type": "application/json" }, body: requestBody }
      );

      if (response.status === 503) {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${apiKey}`,
          { method: "POST", headers: { "Content-Type": "application/json" }, body: requestBody }
        );
      }

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 503 && attempts < maxAttempts - 1) {
          attempts++;
          await sleep(2000 * attempts);
          continue;
        }
        return NextResponse.json({ error: data.error?.message || "Google API Error" }, { status: response.status });
      }

      const rawText = data.candidates[0].content.parts[0].text;
      const cleanJsonStr = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        const concepts = JSON.parse(cleanJsonStr);
        return NextResponse.json({ concepts });
      } catch (parseError) {
        return NextResponse.json({ error: "AI returned invalid format. Please try again." }, { status: 500 });
      }
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}