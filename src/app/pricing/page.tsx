import { auth } from "@/auth";
import Link from "next/link";
import { Sparkles, CheckCircle2, Zap } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/app/actions/billing"; // <-- Imported Action

export default async function PricingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="container mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tighter">
          <Sparkles className="w-6 h-6 text-indigo-500" />
          ReelForge AI
        </Link>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link href="/dashboard" className="text-sm font-medium hover:text-white">Dashboard</Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-white">Login</Link>
              <Link href="/signup" className={cn(buttonVariants(), "bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6")}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="container mx-auto px-6 pt-24 pb-24 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
          Simple, transparent pricing
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-16">
          Start for free, then choose a plan that scales with your content creation needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          
          {/* Creator Plan */}
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl relative flex flex-col">
            <h3 className="text-xl font-bold mb-2">Creator</h3>
            <p className="text-slate-400 text-sm mb-6">Perfect for testing the waters.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$15</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 500 Credits per month</li>
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Standard AI Voices</li>
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 720p Video Exports</li>
            </ul>
            
            {/* SECURE CHECKOUT BUTTON */}
            {isLoggedIn ? (
              <form action={createCheckoutSession}>
                <input type="hidden" name="variantId" value="creator_variant_123" />
                <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-full h-12">Upgrade to Creator</Button>
              </form>
            ) : (
              <Link href="/signup" className={cn(buttonVariants(), "w-full bg-slate-800 hover:bg-slate-700 text-white rounded-full h-12")}>Get Started</Link>
            )}
          </div>

          {/* Pro Plan */}
          <div className="p-8 bg-indigo-950/20 border-2 border-indigo-500 rounded-3xl relative flex flex-col transform md:-translate-y-4 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>
            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">Pro <Zap className="w-5 h-5 text-yellow-400" /></h3>
            <p className="text-slate-400 text-sm mb-6">For serious content creators.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$49</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-400" /> 2,000 Credits per month</li>
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-400" /> Premium Voice Cloning</li>
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-400" /> 1080p & 4K Exports</li>
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-400" /> Remove Watermarks</li>
            </ul>

            {/* SECURE CHECKOUT BUTTON */}
            {isLoggedIn ? (
              <form action={createCheckoutSession}>
                <input type="hidden" name="variantId" value="pro_variant_456" />
                <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-12">Upgrade to Pro</Button>
              </form>
            ) : (
              <Link href="/signup" className={cn(buttonVariants(), "w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-12")}>Get Started</Link>
            )}
          </div>

          {/* Business Plan */}
          <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl relative flex flex-col">
            <h3 className="text-xl font-bold mb-2">Business</h3>
            <p className="text-slate-400 text-sm mb-6">For agencies and teams.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold">$99</span>
              <span className="text-slate-500">/month</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> 5,000 Credits per month</li>
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Custom Font Uploads</li>
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> API Access</li>
              <li className="flex items-center gap-3 text-slate-300"><CheckCircle2 className="w-5 h-5 text-indigo-500" /> Priority Support</li>
            </ul>

            {/* SECURE CHECKOUT BUTTON */}
            {isLoggedIn ? (
              <form action={createCheckoutSession}>
                <input type="hidden" name="variantId" value="business_variant_789" />
                <Button type="submit" className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-full h-12">Upgrade to Business</Button>
              </form>
            ) : (
              <Link href="/signup" className={cn(buttonVariants(), "w-full bg-slate-800 hover:bg-slate-700 text-white rounded-full h-12")}>Get Started</Link>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}