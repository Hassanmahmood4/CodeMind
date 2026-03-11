"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import CodemindLogo from "@/components/CodemindLogo";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login: authLogin } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(email, password);
      authLogin(data.access_token, data.user);
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-6">
          <CodemindLogo size="lg" />
        </div>
        <div className="card w-full border-0">
          <h1 className="text-2xl font-bold mb-6">Log in</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="email" placeholder="Email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-error text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={loading}>{loading ? "Logging in…" : "Log in"}</button>
          </form>
          <p className="mt-4 text-muted text-sm text-center">Don’t have an account? <Link href="/register" className="text-codemind-lime hover:underline">Sign up</Link></p>
        </div>
        <Link href="/" className="mt-4 text-muted hover:text-codemind-lime transition text-sm">← Back</Link>
      </div>
    </div>
  );
}
