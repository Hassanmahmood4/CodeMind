const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function getHeaders(): HeadersInit {
  const token = getToken();
  return { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export type User = { id: number; name: string; email: string; created_at: string };
export type TokenResponse = { access_token: string; token_type: string; user: User };

export async function register(name: string, email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/auth/register`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ name, email, password }) });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Registration failed");
  return res.json();
}

export async function login(email: string, password: string): Promise<TokenResponse> {
  const res = await fetch(`${API_BASE}/auth/login`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ email, password }) });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || "Login failed");
  return res.json();
}

export type ReviewListItem = { id: number; user_id: number; code: string; language: string; ai_feedback: string | null; score: number | null; created_at: string };
export type FeedbackItem = { line: number | null; message: string };
export type Feedback = { score?: number; bugs?: FeedbackItem[]; security?: FeedbackItem[]; performance?: FeedbackItem[]; readability?: FeedbackItem[]; summary?: string };
export type ReviewWithFeedback = { id: number; code: string; language: string; score: number | null; feedback: Feedback; created_at: string };

export async function createReview(code: string, language: string): Promise<ReviewWithFeedback> {
  const res = await fetch(`${API_BASE}/reviews`, { method: "POST", headers: getHeaders(), body: JSON.stringify({ code, language }) });
  if (!res.ok) throw new Error("Failed to create review");
  return res.json();
}

export async function listReviews(): Promise<ReviewListItem[]> {
  const res = await fetch(`${API_BASE}/reviews`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Failed to list reviews");
  return res.json();
}

export async function getReview(id: number): Promise<ReviewWithFeedback> {
  const res = await fetch(`${API_BASE}/reviews/${id}`, { headers: getHeaders() });
  if (!res.ok) throw new Error("Failed to get review");
  return res.json();
}
