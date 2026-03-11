"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import CodemindLogo from "@/components/CodemindLogo";
import { createReview } from "@/lib/api";

const MonacoEditor = dynamic(() => import("@/components/CodeEditor"), { ssr: false });

const LANGUAGES = ["python", "javascript", "typescript", "go", "rust", "java", "cpp", "c", "ruby", "php", "sql", "json"];

export default function ReviewPage() {
  const { token, isReady } = useAuth();
  const router = useRouter();
  const [code, setCode] = useState(`def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nresult = factorial(5)\nprint(result)\n`);
  const [language, setLanguage] = useState("python");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (isReady && !token) { router.push("/login"); return null; }

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const review = await createReview(code, language);
      router.push(`/review/${review.id}`);
    } catch {
      setError("Failed to run review. Is the API running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-codemind-bg px-6 py-4 flex items-center justify-between">
        <CodemindLogo size="md" />
        <Link href="/dashboard" className="text-codemind-white/90 hover:text-codemind-lime transition font-medium">← Dashboard</Link>
      </header>
      <main className="flex-1 flex flex-col p-6 max-w-6xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-4">New code review</h1>
        <div className="flex gap-4 mb-4 items-center">
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className="input w-auto">
            {LANGUAGES.map((lang) => <option key={lang} value={lang}>{lang}</option>)}
          </select>
          <button onClick={handleSubmit} className="btn-primary" disabled={loading}>{loading ? "Analyzing…" : "Run AI review"}</button>
        </div>
        {error && <p className="text-error mb-2">{error}</p>}
        <div className="card flex-1 min-h-[400px] p-0 overflow-hidden">
          <MonacoEditor value={code} onChange={setCode} language={language} />
        </div>
      </main>
    </div>
  );
}
