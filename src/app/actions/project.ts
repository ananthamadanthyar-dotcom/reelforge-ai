"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export async function createProject() {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // Create a blank Draft project in the database
  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      title: "Untitled Video",
      status: "DRAFT"
    }
  });

  // Redirect the user straight into the editor
  redirect(`/projects/${project.id}`);
}