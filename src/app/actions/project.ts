"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function finalizeProject(
  projectId: string, 
  seriesName: string, 
  watermarkImage: string | null,
  watermarkText: string | null
) {
  await prisma.project.update({
    where: { id: projectId },
    data: {
      seriesName,
      watermarkImage,
      status: "GENERATING"
    }
  });

  revalidatePath("/dashboard");
  redirect(`/projects/${projectId}/manage`);
}

export async function deleteProject(projectId: string) {
  await prisma.project.delete({
    where: { id: projectId }
  });
  
  revalidatePath("/dashboard");
  redirect("/dashboard");
}