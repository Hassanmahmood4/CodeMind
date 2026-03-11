"use client";

import { Upload, Sparkles, Download } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "Paste your code or connect your repository",
    description: "Upload a file, paste a snippet, or link your GitHub repo. No setup required.",
    icon: Upload,
  },
  {
    step: 2,
    title: "AI analyzes bugs, security, and performance",
    description: "Our model reviews style, security, and best practices in seconds.",
    icon: Sparkles,
  },
  {
    step: 3,
    title: "Receive instant suggestions and improvements",
    description: "Get actionable feedback you can apply directly in your editor.",
    icon: Download,
  },
];

export default function HowItWorks() {
  return (
    <section className="border-t border-white/10 py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
          How it works
        </h2>
        <p className="mx-auto mb-14 max-w-xl text-center text-white/60">
          Three simple steps to better code.
        </p>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map(({ step, title, description, icon: Icon }) => (
            <div
              key={step}
              className="group rounded-xl border border-white/10 bg-[#1F2937] p-8 shadow-lg transition-all duration-300 hover:border-cyan-400/20 hover:shadow-[0_0_32px_rgba(6,182,212,0.1)]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-400/20 via-cyan-400/20 to-blue-500/20 text-cyan-400 transition-all duration-300 group-hover:scale-110">
                <Icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <p className="mb-2 text-sm font-semibold text-cyan-400">Step {step}</p>
              <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
              <p className="text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
