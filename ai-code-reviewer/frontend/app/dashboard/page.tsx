"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import CodemindLogo from "@/components/CodemindLogo";
import { listReviews, type ReviewListItem } from "@/lib/api";
import { FileCode, LogOut } from "lucide-react";

export default function DashboardPage() {
  const { user, token, logout, isReady } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<ReviewListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isReady) return;
    if (!token) { router.push("/login"); return; }
    listReviews().then(setReviews).catch(() => setError("Failed to load reviews")).finally(() => setLoading(false));
  }, [isReady, token, router]);

  if (!isReady || !token) return null;

  return (
    <div className="min-h-screen">
      <header className="bg-[#0B0F19] border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <CodemindLogo size="md" showTagline theme="dark" />
        <div className="flex items-center gap-4">
          <span className="text-muted text-sm">{user?.email}</span>
          <Link href="/review" className="btn-primary">New review</Link>
          <button onClick={() => { logout(); router.push("/"); }} className="text-white/90 hover:text-cyan-400 transition font-medium flex items-center gap-1"><LogOut className="w-4 h-4" /> Log out</button>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold mb-6">Review history</h1>
        {error && <p className="text-error mb-4">{error}</p>}
        {loading ? <p className="text-muted">Loading…</p> : reviews.length === 0 ? (
          <div className="card text-center py-12">
            <FileCode className="w-12 h-12 mx-auto text-muted mb-4" />
            <p className="text-muted mb-4">No reviews yet.</p>
            <Link href="/review" className="btn-primary">Run your first review</Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {reviews.map((r) => (
              <li key={r.id}>
                <Link href={`/review/${r.id}`} className="card block hover:border-cyan-400/30 transition">
                  <div className="flex justify-between items-start">
                    <div><span className="font-mono text-sm text-muted">{r.language}</span>{r.score != null && <span className="ml-2 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text font-medium text-transparent">Score: {Math.round(r.score)}/100</span>}</div>
                    <time className="text-sm text-muted">{new Date(r.created_at).toLocaleDateString()}</time>
                  </div>
                  <pre className="mt-2 text-sm text-muted overflow-hidden text-ellipsis whitespace-pre max-h-12">{r.code}</pre>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
