import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * All backend API requests go through this module.
 * Code review is performed by the Gemini API on the backend. Clerk is used only for authentication (session token).
 */

/**
 * POST /api/chat – send message and get AI response (Gemini API performs the review)
 * @param {string} message - User message
 * @param {string|null} token - Clerk session token from useAuth().getToken(); required for backend auth
 * @returns {Promise<{ response: string }>}
 */
export async function sendChatMessage(message, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const { data } = await axios.post(`${API_BASE}/api/chat`, { message }, { headers });
  return data;
}

const CODE_REVIEW_PROMPT = (language, code) =>
  `You are a code reviewer. Review this ${language} code. Reply in Markdown with: 1) **Summary** (one sentence), 2) **Issues** (bullets), 3) **Suggestions** (brief), 4) **Suggested fixes** (code blocks if needed). Be concise. Code:

\`\`\`${language}
${code}
\`\`\``;

/**
 * Submit code for AI review. Backend uses Gemini API for the review; token is for auth only.
 * @param {string} code - Source code to review
 * @param {string} language - Language identifier (e.g. javascript, python)
 * @param {string} token - Clerk session token (authentication only)
 * @returns {Promise<{ response: string }>}
 */
export async function submitCodeForReview(code, language, token) {
  const message = CODE_REVIEW_PROMPT(language, code);
  return sendChatMessage(message, token);
}

/**
 * Submit code for review with streaming – text appears as it's generated (faster feel).
 * @param {string} code - Source code to review
 * @param {string} language - Language identifier
 * @param {string|null} token - Clerk session token
 * @param {(chunk: string) => void} onChunk - Called for each streamed text chunk
 * @returns {Promise<string>} Full response text
 */
export async function submitCodeForReviewStream(code, language, token, onChunk) {
  const message = CODE_REVIEW_PROMPT(language, code);
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/api/chat/stream`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let full = '';
  let buffer = '';
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      const t = line.trim();
      if (!t) continue;
      try {
        const data = JSON.parse(t);
        if (data.error) throw new Error(data.error);
        if (data.text) {
          full += data.text;
          onChunk(data.text);
        }
      } catch (e) {
        if (e instanceof SyntaxError) continue;
        throw e;
      }
    }
  }
  if (buffer.trim()) {
    try {
      const data = JSON.parse(buffer.trim());
      if (data.text) {
        full += data.text;
        onChunk(data.text);
      }
    } catch (_) {}
  }
  return full;
}

/**
 * Review an entire GitHub repository (POST /api/review-repo). Backend uses Gemini API for the review.
 * @param {string} repoUrl - GitHub repository URL
 * @param {string} token - Clerk session token (auth only; from useAuth().getToken())
 * @returns {Promise<{ repoName: string, filesAnalyzed: string[], suggestions: Array<{ file, type, issue, suggestedFix }> }>}
 */
export async function reviewRepository(repoUrl, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const { data } = await axios.post(
    `${API_BASE}/api/review-repo`,
    { repoUrl: repoUrl.trim() },
    { headers }
  );
  return data;
}

const reviewHeaders = (token) => {
  const h = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
};

/** Save current editor review to backend (for sidebar history). */
export async function saveReview(payload, token) {
  const { data } = await axios.post(`${API_BASE}/api/reviews`, payload, {
    headers: reviewHeaders(token),
  });
  return data;
}

/** List current user's saved reviews (for sidebar). */
export async function getReviews(token) {
  const { data } = await axios.get(`${API_BASE}/api/reviews`, {
    headers: reviewHeaders(token),
  });
  return data;
}

/** Get one saved review by id (load into editor). */
export async function getReview(id, token) {
  const { data } = await axios.get(`${API_BASE}/api/reviews/${id}`, {
    headers: reviewHeaders(token),
  });
  return data;
}

/** Delete a saved review. */
export async function deleteReview(id, token) {
  await axios.delete(`${API_BASE}/api/reviews/${id}`, {
    headers: reviewHeaders(token),
  });
}

/** Rename a saved review. */
export async function renameReview(id, title, token) {
  const { data } = await axios.patch(
    `${API_BASE}/api/reviews/${id}`,
    { title },
    { headers: reviewHeaders(token) }
  );
  return data;
}
