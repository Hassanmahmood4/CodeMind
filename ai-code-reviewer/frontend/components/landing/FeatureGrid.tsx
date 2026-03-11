"use client";

import {
  Bug,
  Shield,
  Zap,
  FileCode,
  GitBranch,
  MessageSquare,
} from "lucide-react";

const features = [
  {
    title: "Bug Detection",
    description: "Catch logic errors and edge cases before they reach production.",
    icon: Bug,
    iconColor: "text-red-500 bg-red-500/15",
  },
  {
    title: "Security Analysis",
    description: "Spot vulnerabilities, hardcoded secrets, and unsafe patterns.",
    icon: Shield,
    iconColor: "text-amber-500 bg-amber-500/15",
  },
  {
    title: "Performance Optimization",
    description: "Get suggestions to speed up your code and reduce bottlenecks.",
    icon: Zap,
    iconColor: "text-blue-500 bg-blue-500/15",
  },
  {
    title: "Readable Code Suggestions",
    description: "Improve clarity and maintainability with style and structure tips.",
    icon: FileCode,
    iconColor: "text-green-500 bg-green-500/15",
  },
  {
    title: "Repository Integration",
    description: "Connect GitHub and run reviews on push or pull request.",
    icon: GitBranch,
    iconColor: "text-cyan-400 bg-cyan-400/15",
  },
  {
    title: "Instant Feedback",
    description: "Results in seconds so you can iterate without waiting.",
    icon: MessageSquare,
    iconColor: "text-cyan-400 bg-cyan-400/15",
  },
];

export default function FeatureGrid() {
  return (
    <section className="border-t border-white/10 py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
          Everything you need
        </h2>
        <p className="mx-auto mb-16 max-w-xl text-center text-white/60">
          Built for developers who care about code quality.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ title, description, icon: Icon, iconColor }, i) => (
            <div
              key={title}
              className="group rounded-xl border border-white/10 bg-[#1F2937] p-8 shadow-lg transition-all duration-300 hover:border-cyan-400/20 hover:shadow-[0_0_32px_rgba(6,182,212,0.1)]"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${iconColor} transition-transform duration-300 group-hover:scale-110`}>
                <Icon className="h-6 w-6" strokeWidth={1.8} />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
              <p className="text-sm leading-relaxed text-white/60">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
