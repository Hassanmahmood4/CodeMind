import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/react';
import { submitCodeForReview, submitCodeForReviewStream } from '../lib/api';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'cpp', label: 'C++' },
  { id: 'java', label: 'Java' },
];

export { LANGUAGES };

/**
 * Review state and actions: code, language, result, loading, error, submit
 */
export function useReview() {
  const { getToken, isSignedIn } = useAuth();
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitReview = useCallback(async () => {
    if (!isSignedIn) {
      setError('Please sign in to submit code for review.');
      return;
    }
    const trimmed = code?.trim();
    if (!trimmed) {
      setError('Please enter or paste some code to review.');
      return;
    }

    setLoading(true);
    setError(null);
    setReview(null);

    try {
      // Ensure Clerk can see the publishable key when requesting the token
      const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
      if (typeof window !== 'undefined' && key) {
        window.VITE_CLERK_PUBLISHABLE_KEY = key;
        window.CLERK_PUBLISHABLE_KEY = key;
      }
      if (typeof globalThis !== 'undefined' && key) {
        globalThis.VITE_CLERK_PUBLISHABLE_KEY = key;
        globalThis.CLERK_PUBLISHABLE_KEY = key;
      }

      let token = null;
      try {
        // Prefer fresh token so backend does not receive an expired JWT
        token = await getToken();
        if (!token) token = await getToken({ skipCache: true });
      } catch (tokenErr) {
        // Dev bypass: try request without token when getToken fails (e.g. Clerk config)
        try {
          await submitCodeForReviewStream(trimmed, language, null, (chunk) =>
            setReview((prev) => (prev || '') + chunk)
          );
          return;
        } catch (apiErr) {
          if (apiErr.response?.status === 401) {
            setError('Token issue: Sign out (click your email → Sign out), then sign in again. In Clerk Dashboard set Configure → Paths → Fallback development host to http://localhost:5173 and save.');
          } else {
            setError(apiErr.response?.data?.error || apiErr.message || 'Request failed');
          }
          return;
        }
      }
      if (!token) {
        try {
          await submitCodeForReviewStream(trimmed, language, null, (chunk) =>
            setReview((prev) => (prev || '') + chunk)
          );
          return;
        } catch (apiErr) {
          if (apiErr.response?.status === 401) {
            setError('Session expired or invalid. Please sign out and sign in again.');
          } else {
            setError(apiErr.response?.data?.error || apiErr.message || 'Request failed');
          }
          return;
        }
      }

      // Stream response so review appears as it's generated (faster feel)
      await submitCodeForReviewStream(trimmed, language, token, (chunk) =>
        setReview((prev) => (prev || '') + chunk)
      );
    } catch (err) {
      let message = err.response?.data?.error || err.message || 'Request failed';
      if (typeof message === 'string' && /publishable\s*key|Publishable\s*key\s*is\s*missing/i.test(message)) {
        message = 'Token issue: Sign out (click your email → Sign out), then sign in again. If it still fails, in Clerk Dashboard set Configure → Paths → Fallback development host to http://localhost:5173 and save.';
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [code, language, isSignedIn, getToken]);

  const clearReview = useCallback(() => {
    setReview(null);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setCode('');
    setReview(null);
    setError(null);
  }, []);

  return {
    code,
    setCode,
    language,
    setLanguage,
    review,
    setReview,
    loading,
    error,
    submitReview,
    clearReview,
    reset,
    isSignedIn: !!isSignedIn,
  };
}
