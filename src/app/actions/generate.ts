"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function generateScript(projectId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const topic = formData.get("topic") as string;
  const duration = formData.get("duration") as string;
  const tone = formData.get("tone") as string;

  if (!topic) return { error: "Topic is required" };

  // 1. Check if user has enough credits
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { creditBalance: true }
  });

  if (!user?.creditBalance || user.creditBalance.amount < 1) {
    return { error: "Not enough credits. Please upgrade your plan." };
  }

  // 2. Deduct 1 credit securely
  await prisma.creditBalance.update({
    where: { userId: session.user.id },
    data: { amount: { decrement: 1 } }
  });

  // 3. Update the project title in the database
  await prisma.project.update({
    where: { id: projectId },
    data: { title: topic.substring(0, 40) + (topic.length > 40 ? "..." : "") }
  });

  // 4. Simulate the LLM API Delay (2.5 seconds)
  await new Promise(resolve => setTimeout(resolve, 2500));

  // 5. Generate a Demo Script based on their inputs
  const demoScript = 
`[Scene 1: Hook - 0:00-0:05]
(Visual: Fast zoom in on the subject)
Voiceover: "Did you know that ${topic} will completely change how you see the world?"

[Scene 2: Context - 0:05-0:15]
(Visual: Cinematic panning shot)
Voiceover: "For years, experts have hidden the truth about this. But today, we're breaking it down in a ${tone} way."

[Scene 3: The Big Reveal - 0:15-0:25]
(Visual: Dramatic text overlay popping on screen)
Voiceover: "The secret lies in the incredible power of how this affects our daily lives."

[Scene 4: Call to Action - 0:25-0:30]
(Visual: Subscribe button animation)
Voiceover: "Hit follow for more mind-blowing facts!"`;

  // Tell Next.js to refresh the dashboard data so the credit counter updates!
  revalidatePath("/dashboard");
  revalidatePath(`/projects/${projectId}`);

  return { success: true, script: demoScript };
}