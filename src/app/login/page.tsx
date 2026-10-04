"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevents the default form submission refresh
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      // Client-side sign-in from next-auth/react
      const res = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid email or password. Please try again.");
        setIsLoading(false);
      } else if (res?.ok) {
        // Force a router refresh to update server components, then redirect
        router.refresh();
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tighter mb-2">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            ReelForge AI
          </Link>
          <p className="text-slate-400 text-sm text-center">
            Welcome back! Log in to continue creating.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-12 mt-4 text-base font-medium shadow-lg shadow-indigo-900/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-slate-400 text-sm mt-8">
          Don't have an account?{" "}
          <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Sign up here
          </Link>
        </p>

      </div>
    </div>
  );
}