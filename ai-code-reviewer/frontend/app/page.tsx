"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import CodemindLogo from "@/components/CodemindLogo";

export default function HomePage() {
  const { user, isReady } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-codemind-bg px-6 py-4 flex items-center justify-between">
        <CodemindLogo size="md" showTagline />
        <nav className="flex gap-4">
          {isReady && user ? (
            <>
              <Link href="/dashboard" className="text-codemind-white/90 hover:text-codemind-lime transition font-medium">Dashboard</Link>
              <Link href="/review" className="px-4 py-2 rounded-lg font-medium bg-codemind-lime text-codemind-bg hover:opacity-90 transition">New review</Link>
            </>
          ) : (
            <>
              <Link href="/login" className="text-codemind-white/90 hover:text-codemind-lime transition font-medium">Log in</Link>
              <Link href="/register" className="px-4 py-2 rounded-lg font-medium bg-codemind-lime text-codemind-bg hover:opacity-90 transition">Sign up</Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center max-w-2xl mx-auto">
        <div className="mb-6">
          <CodemindLogo size="lg" className="justify-center" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-codemind-white">
          AI-Powered Code Review
        </h1>
        <p className="text-muted text-lg mb-8">
          Paste code, upload files, or connect a repo. Get instant feedback on bugs, security, performance, and readability.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/register" className="text-lg px-6 py-3 rounded-lg font-medium bg-codemind-lime text-codemind-bg hover:opacity-90 transition">Get started free</Link>
          <Link href="/review" className="text-lg px-6 py-3 rounded-lg font-medium border-2 border-codemind-lime text-codemind-lime hover:bg-codemind-lime/10 transition">Try demo</Link>
        </div>
        <ul className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-muted">
          {["Bug detection", "Security warnings", "Performance tips", "Readability feedback"].map((item) => (
            <li key={item} className="flex items-center gap-2"><span className="text-success">✓</span> {item}</li>
          ))}
        </ul>
      </main>
    </div>
  );
}
