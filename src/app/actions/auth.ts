"use server";

import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Email is already registered" };
  }

  // Securely hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user AND give them 100 free credits automatically
  await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      creditBalance: {
        create: { amount: 100 }
      }
    }
  });

  return { success: true };
}