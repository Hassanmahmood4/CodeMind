"use client";

import CTAButton from "./CTAButton";
import CodeMindLogo from "@/components/CodemindLogo";

export default function Hero() {
  return (
    <section className="hero-gradient relative flex flex-col items-center px-4 pb-28 pt-24 sm:px-6 sm:pb-32 sm:pt-28 md:pt-32 lg:pt-36">
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <CodeMindLogo size="hero" theme="dark" showImage={false} className="mb-3 flex items-center justify-center sm:mb-4" />
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:mb-8 sm:text-5xl md:text-6xl lg:text-7xl">
          <span className="block bg-gradient-to-r from-white to-white/90 bg-clip-text text-transparent">
            AI-Powered Code Review
          </span>
        </h1>
        <p className="mb-12 max-w-xl text-lg leading-relaxed text-white/70 sm:mb-14 sm:text-xl">
          Paste code, upload files, or connect a repository to get instant feedback.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <CTAButton href="/register" variant="primary">
            Get started free
          </CTAButton>
          <CTAButton href="/review" variant="secondary">
            Try demo
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
