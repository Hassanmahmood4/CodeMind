import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * All backend API requests go through this module.
 * Code review is performed by the Gemini API on the backend. Clerk is used only for authentication (session token).
 */

/**
 * POST /api/chat – send message and get AI response (Gemini API performs the review)
 * @param {string} message - User message
 * @param {string} token - Clerk session token (auth only; from useAuth().getToken())
 * @returns {Promise<{ response: string }>}
 */
export async function sendChatMessage(message, token) {
  if (!token) {
    throw new Error('Missing token. Please sign in and try again.');
  }
  const { data } = await axios.post(
    `${API_BASE}/api/chat`,
    { message },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
}

/**
 * Submit code for AI review. Backend uses Gemini API for the review; token is for auth only.
 * @param {string} code - Source code to review
 * @param {string} language - Language identifier (e.g. javascript, python)
 * @param {string} token - Clerk session token (authentication only)
 * @returns {Promise<{ response: string }>}
 */
export async function submitCodeForReview(code, language, token) {
  const message = `You are a code reviewer. Review the following ${language} code and respond in Markdown with these sections:

1. **Summary** – One short sentence on overall quality.
2. **Issues** – List any bugs, security risks, or correctness problems (use bullet points).
3. **Suggestions** – Improvements for readability, performance, or best practices.
4. **Suggested fixes** – If you recommend code changes, show them in fenced code blocks with the correct language tag.

Be concise and actionable. Here is the code:

\`\`\`${language}
${code}
\`\`\``;
  return sendChatMessage(message, token);
}

/**
 * Review an entire GitHub repository (POST /api/review-repo). Backend uses Gemini API for the review.
 * @param {string} repoUrl - GitHub repository URL
 * @param {string} token - Clerk session token (auth only; from useAuth().getToken())
 * @returns {Promise<{ repoName: string, filesAnalyzed: string[], suggestions: Array<{ file, type, issue, suggestedFix }> }>}
 */
export async function reviewRepository(repoUrl, token) {
  if (!token) {
    throw new Error('Missing token. Please sign in and try again.');
  }
  const { data } = await axios.post(
    `${API_BASE}/api/review-repo`,
    { repoUrl: repoUrl.trim() },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return data;
}
