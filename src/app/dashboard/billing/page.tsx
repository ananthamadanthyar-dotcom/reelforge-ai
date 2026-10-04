"use client";

import { useState } from "react";
import { LayoutGrid, Share2, Music, Sparkles, AudioLines, Check, Info, Plus, Minus } from "lucide-react";
import Link from "next/link";

const PLANS = [
  {
    name: "Hobby",
    monthlyPrice: 19,
    monthlyOriginal: 29,
    yearlyPrice: 171,
    yearlyOriginal: 228,
    description: "Best for creators starting with faceless content",
    features: [
      "Posts 3 times per week",
      "Automated posting",
      "Background music",
      "6+ video art styles",
      "Custom AI voiceover",
      "No watermark"
    ],
    monthlyCheckoutUrl: "https://reelforge-ai.lemonsqueezy.com/checkout/buy/aba863ac-0cb2-4dc4-84eb-0b44acf2300a",
    yearlyCheckoutUrl: "https://reelforge-ai.lemonsqueezy.com/checkout/buy/ac75afbd-8ffb-4731-926c-eda0daa7d0bd",
  },
  {
    name: "Daily",
    monthlyPrice: 39,
    monthlyOriginal: 59,
    yearlyPrice: 351,
    yearlyOriginal: 468,
    description: "Best for creators who want to grow fast",
    features: [
      "Posts every day",
      "Automated posting",
      "Background music",
      "6+ video art styles",
      "Custom AI voiceover",
      "Text watermark"
    ],
    monthlyCheckoutUrl: "https://reelforge-ai.lemonsqueezy.com/checkout/buy/d5d15010-8454-4a6a-afe3-86137ec928f3",
    yearlyCheckoutUrl: "https://reelforge-ai.lemonsqueezy.com/checkout/buy/37fdc327-64e4-45b8-be43-19ff529f3de0",
  },
  {
    name: "Pro",
    monthlyPrice: 69,
    monthlyOriginal: 89,
    yearlyPrice: 621,
    yearlyOriginal: 828,
    description: "Best for creators who want to grow super fast",
    features: [
      "Posts 2 times per day",
      "Automated posting",
      "Background music",
      "6+ video art styles",
      "Custom AI voiceover",
      "Custom watermark"
    ],
    monthlyCheckoutUrl: "https://reelforge-ai.lemonsqueezy.com/checkout/buy/0b467ea3-f31d-4ca2-8df7-f66dd7f87187",
    yearlyCheckoutUrl: "https://reelforge-ai.lemonsqueezy.com/checkout/buy/a1387191-a5bd-4503-8f51-65da7791eb47",
  }
];

export default function PricingPage() {
  const [seriesCount, setSeriesCount] = useState(1);
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly");

  const increment = () => setSeriesCount(prev => prev + 1);
  const decrement = () => setSeriesCount(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="min-h-screen bg-[#030712] text-slate-50 font-sans py-12 px-6">
      <div className="max-w-[1000px] mx-auto">
        
        {/* Navigation Bar */}
        <div className="flex justify-between items-center mb-12">
          <Link href="/" className="text-xl font-bold text-white tracking-tight">
            ReelForge <span className="text-[#a855f7]">AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-slate-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="text-sm bg-[#a855f7] hover:bg-[#9333ea] text-white px-4 py-2 rounded-xl transition-colors font-semibold">
              Get Started
            </Link>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Subscription plans</h1>
            <p className="text-slate-400 text-sm">Choose the perfect plan to empower your content creation</p>
          </div>

          {/* Monthly / Yearly Toggle */}
          <div className="bg-[#0f172a] p-1.5 rounded-xl border border-slate-800 flex items-center self-start">
            <button
              onClick={() => setBillingInterval("monthly")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                billingInterval === "monthly" 
                  ? "bg-[#a855f7] text-white shadow-sm" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingInterval("yearly")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                billingInterval === "yearly" 
                  ? "bg-[#a855f7] text-white shadow-sm" 
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded-full uppercase tracking-wide font-bold">Save 25%</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {PLANS.map((plan) => {
            const price = billingInterval === "monthly" ? plan.monthlyPrice : plan.yearlyPrice;
            const original = billingInterval === "monthly" ? plan.monthlyOriginal : plan.yearlyOriginal;
            const checkoutUrl = billingInterval === "monthly" ? plan.monthlyCheckoutUrl : plan.yearlyCheckoutUrl;

            return (
              <div 
                key={plan.name}
                className="bg-[#0f172a] border border-slate-800/60 rounded-2xl p-6 flex flex-col hover:border-slate-700 transition-colors shadow-sm"
              >
                <div className="mb-6">
                  <h3 className="text-slate-300 mb-2 font-medium">
                    {plan.name} {seriesCount > 1 && <span className="text-[#a855f7] text-sm">({seriesCount} Series)</span>}
                  </h3>
                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-4xl font-bold text-white">${price * seriesCount}</span>
                    <span className="text-slate-500 text-sm">/{billingInterval === "monthly" ? "mo" : "yr"}</span>
                  </div>
                  <div className="text-sm text-slate-600 line-through mb-2">${original * seriesCount}/{billingInterval === "monthly" ? "mo" : "yr"}</div>
                  <p className="text-xs text-slate-400">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8 text-sm text-slate-300 flex-1">
                  <li className="flex items-center gap-3">
                    <LayoutGrid className="w-4 h-4 text-[#a855f7]" />
                    <span className="font-semibold text-white">{plan.features[0]}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Share2 className="w-4 h-4 text-[#a855f7]" />
                    <span>{plan.features[1]}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Music className="w-4 h-4 text-[#a855f7]" />
                    <span>{plan.features[2]}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#a855f7]" />
                    <span>{plan.features[3]}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <AudioLines className="w-4 h-4 text-[#a855f7]" />
                    <span>{plan.features[4]}</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#a855f7]" />
                    <span>{plan.features[5]}</span>
                  </li>
                </ul>

                <a 
                  href={`${checkoutUrl}?quantity=${seriesCount}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#a855f7] hover:bg-[#9333ea] text-white text-sm font-semibold flex justify-center items-center transition-colors"
                >
                  Upgrade {seriesCount > 1 ? `(${seriesCount} Series)` : ""}
                </a>
              </div>
            );
          })}
        </div>

        {/* Series Multiplier Controller */}
        <div className="bg-[#0f172a] border border-slate-800/60 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1 bg-[#a855f7]/10 rounded text-[#a855f7]">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-lg text-white">Series</h3>
              <Info className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-slate-400 text-sm">Manage how many video series you can create simultaneously.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#030712] px-4 py-2 rounded-lg font-semibold text-slate-300 min-w-[3rem] text-center border border-slate-800">
              {seriesCount}
            </div>
            <button 
              onClick={increment}
              className="p-2 border border-slate-700 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button 
              onClick={decrement}
              className="p-2 border border-slate-700 rounded-lg hover:bg-slate-800 text-slate-400 transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}