import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/react';
import { submitCodeForReview } from '../lib/api';

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
      const token = await getToken({ skipCache: true });
      if (!token) {
        setError('Session expired or invalid. Please sign in again.');
        return;
      }
      const { response } = await submitCodeForReview(trimmed, language, token);
      setReview(typeof response === 'string' ? response : String(response ?? ''));
    } catch (err) {
      const message = err.response?.data?.error || err.message;
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
    loading,
    error,
    submitReview,
    clearReview,
    reset,
    isSignedIn: !!isSignedIn,
  };
}
