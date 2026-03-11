"use client";

import { Github, Zap, Star } from "lucide-react";

const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons";

const techs = [
  { name: "JavaScript", logo: `${DEVICON}/javascript/javascript-original.svg` },
  { name: "Python", logo: `${DEVICON}/python/python-original.svg` },
  { name: "TypeScript", logo: `${DEVICON}/typescript/typescript-original.svg` },
  { name: "React", logo: `${DEVICON}/react/react-original.svg` },
  { name: "Node.js", logo: `${DEVICON}/nodejs/nodejs-original.svg` },
];

const stats = [
  { value: "10k+", label: "Reviews" },
  { value: "50+", label: "Checks" },
  { value: "&lt;2s", label: "Avg. response" },
];

export default function TrustSection() {
  return (
    <section className="border-t border-white/10 py-20 sm:py-24 md:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-center text-3xl font-bold text-white sm:text-4xl">
          Trusted by developers building modern software
        </h2>
        <p className="mx-auto mb-14 max-w-xl text-center text-white/60">
          Join teams who ship better code with AI-powered review.
        </p>

        <div className="mx-auto mb-14 max-w-2xl rounded-xl border border-white/10 bg-[#1F2937] p-8 shadow-lg">
          <div className="flex flex-wrap items-center justify-center gap-8">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <p className="bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">{value}</p>
                <p className="text-sm text-white/60">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-14 flex flex-wrap items-center justify-center gap-6">
          {techs.map(({ name, logo }) => (
            <div
              key={name}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#1F2937] px-5 py-3 font-mono text-sm font-medium text-white/80 shadow-lg transition-all hover:border-cyan-400/30 hover:text-cyan-400"
            >
              <img
                src={logo}
                alt=""
                width={20}
                height={20}
                className="h-4 w-4 shrink-0 object-contain"
              />
              {name}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-[#1F2937] px-6 py-3 text-white/90 shadow-lg transition-all hover:border-cyan-400/30 hover:text-cyan-400"
          >
            <Github className="h-5 w-5" />
            <span className="font-medium">Star on GitHub</span>
            <span className="flex items-center gap-1 rounded bg-white/10 px-2 py-0.5 text-sm">
              <Star className="h-3.5 w-3.5 fill-current" />
              2.1k
            </span>
          </a>
          <div className="flex items-center gap-2 text-white/50">
            <Zap className="h-4 w-4 text-cyan-400/70" />
            <span className="text-sm">Fast · Secure · Private</span>
          </div>
        </div>
      </div>
    </section>
  );
}
