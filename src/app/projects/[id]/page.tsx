"use client";

import { useState, use } from "react";
import { NicheGenerator } from "./NicheGenerator";
import { LanguageVoiceGenerator } from "./LanguageVoiceGenerator";
import { BackgroundMusicGenerator } from "./BackgroundMusicGenerator";
import { CaptionStyleGenerator } from "./CaptionStyleGenerator";
import { EffectsGenerator } from "./EffectsGenerator";
import { SeriesDetailsGenerator } from "./SeriesDetailsGenerator"; // We will include Socials inside here or right beside it

const STEPS = [
  "Niche",
  "Language & Voice",
  "Background Music",
  "Caption Style",
  "Effects",
  "Socials & Series Details"
];

export default function ProjectWizard({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  
  const handleFinish = () => {
    console.log("Saving project...");
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center pt-10">
      <div className="w-full max-w-4xl px-6">
        
        {/* Horizontal Progress Bar (6 Steps Total) */}
        <div className="flex gap-2 w-full mb-10">
          {STEPS.map((_, index) => (
            <div 
              key={index} 
              className={`h-2 flex-1 rounded-full transition-colors ${
                index + 1 <= currentStep ? "bg-purple-600" : "bg-slate-800"
              }`} 
            />
          ))}
        </div>

        {/* Dynamic Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{STEPS[currentStep - 1]}</h1>
            <span className="px-3 py-1 bg-purple-600/20 text-purple-400 text-xs font-semibold rounded-full border border-purple-500/30">
              Step {currentStep} of 6
            </span>
          </div>
        </div>

        {/* Step Content Rendering (1 through 6) */}
        <div className="w-full pb-20">
          {currentStep === 1 && <NicheGenerator onContinue={handleNext} />}
          {currentStep === 2 && <LanguageVoiceGenerator onBack={handleBack} onContinue={handleNext} />}
          {currentStep === 3 && <BackgroundMusicGenerator onBack={handleBack} onContinue={handleNext} />}
          {currentStep === 4 && <CaptionStyleGenerator onBack={handleBack} onContinue={handleNext} />}
          {currentStep === 5 && <EffectsGenerator onBack={handleBack} onContinue={handleNext} />}
          
          {/* Step 6: Combined Social Accounts & Series Details / Watermark */}
          {currentStep === 6 && (
            <SeriesDetailsGenerator 
              projectId={projectId} 
              onBack={handleBack} 
              onFinish={handleFinish} 
            />
          )}
        </div>

      </div>
    </div>
  );
}