"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter hover:opacity-80 transition">
            <Sparkles className="w-6 h-6 text-indigo-500" /> ReelForge AI
          </Link>
        </div>
        
        <h2 className="text-2xl font-bold mb-2 text-center">Welcome back</h2>
        <p className="text-slate-400 text-center mb-8">Enter your details to sign in to your account</p>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="bg-slate-950 border-slate-800" placeholder="you@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required className="bg-slate-950 border-slate-800" placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          Don't have an account? <Link href="/signup" className="text-indigo-400 hover:text-indigo-300">Sign up</Link>
        </p>
      </div>
    </div>
  );
}