"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useAuth } from "@/components/AuthProvider";
import CodemindLogo from "@/components/CodemindLogo";
import { getReview, type ReviewWithFeedback, type FeedbackItem } from "@/lib/api";
import { Bug, Shield, Zap, BookOpen } from "lucide-react";

const MonacoEditor = dynamic(() => import("@/components/CodeEditor"), { ssr: false });

function IssueList({ title, items, icon: Icon, color }: { title: string; items: FeedbackItem[]; icon: React.ComponentType<{ className?: string }>; color: string }) {
  if (!items?.length) return null;
  return (
    <div className="mb-4">
      <h3 className={`flex items-center gap-2 font-medium mb-2 ${color}`}><Icon className="w-4 h-4" /> {title}</h3>
      <ul className="list-disc list-inside space-y-1 text-sm text-muted">
        {items.map((item, i) => <li key={i}>{item.line != null ? `Line ${item.line}: ` : ""}{item.message}</li>)}
      </ul>
    </div>
  );
}

export default function ReviewResultPage() {
  const params = useParams();
  const router = useRouter();
  const { token, isReady } = useAuth();
  const [review, setReview] = useState<ReviewWithFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isReady || !token) { if (isReady) router.push("/login"); return; }
    const id = Number(params.id);
    if (!id) return;
    getReview(id).then(setReview).catch(() => setError("Failed to load review")).finally(() => setLoading(false));
  }, [isReady, token, params.id, router]);

  if (!isReady || !token) return null;
  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>;
  if (error || !review) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-error">{error || "Review not found"}</p>
      <Link href="/dashboard" className="px-4 py-2 rounded-lg font-medium bg-codemind-lime text-codemind-bg hover:opacity-90">Back to dashboard</Link>
    </div>
  );

  const f = review.feedback;
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-codemind-bg px-6 py-4 flex items-center justify-between">
        <CodemindLogo size="md" />
        <Link href="/dashboard" className="text-codemind-white/90 hover:text-codemind-lime transition font-medium">← Dashboard</Link>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-4">Review result</h1>
          {review.score != null && (
            <div className="card mb-6">
              <p className="text-muted text-sm mb-1">Code quality score</p>
              <p className="text-4xl font-bold text-accent">{Math.round(review.score)}<span className="text-2xl text-muted">/100</span></p>
            </div>
          )}
          {f.summary && <p className="text-muted mb-6">{f.summary}</p>}
          <div className="card">
            <IssueList title="Bugs" items={f.bugs || []} icon={Bug} color="text-error" />
            <IssueList title="Security" items={f.security || []} icon={Shield} color="text-warn" />
            <IssueList title="Performance" items={f.performance || []} icon={Zap} color="text-accent" />
            <IssueList title="Readability" items={f.readability || []} icon={BookOpen} color="text-success" />
            {!(f.bugs?.length || f.security?.length || f.performance?.length || f.readability?.length) && <p className="text-muted">No specific issues reported.</p>}
          </div>
        </div>
        <div className="card p-0 overflow-hidden min-h-[400px]">
          <div className="px-4 py-2 border-b border-border flex justify-between items-center">
            <span className="font-mono text-sm text-muted">{review.language}</span>
            <time className="text-sm text-muted">{new Date(review.created_at).toLocaleString()}</time>
          </div>
          <MonacoEditor value={review.code} onChange={() => {}} language={review.language} readOnly={true} />
        </div>
      </main>
    </div>
  );
}
