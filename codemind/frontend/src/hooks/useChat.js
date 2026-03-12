import { useState, useCallback } from 'react';
import { useAuth } from '@clerk/react';
import { sendChatMessage } from '../lib/api';

/**
 * Chat state and actions: messages, send, loading, error
 * @returns {{ messages: Array<{role: string, content: string}>, sendMessage: (text: string) => Promise<void>, loading: boolean, error: string | null, clearError: () => void }}
 */
export function useChat() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(
    async (text) => {
      const trimmed = text?.trim();
      if (!trimmed) return;

      setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
      setLoading(true);
      setError(null);

      try {
        const token = await getToken({ skipCache: true });
        if (!token) {
          setError('Session expired or invalid. Please sign in again.');
          setLoading(false);
          return;
        }
        const { response } = await sendChatMessage(trimmed, token);
        setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      } catch (err) {
        const message = err.response?.data?.error || err.message;
        setError(message);
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: `Error: ${message}` },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [getToken]
  );

  const clearError = useCallback(() => setError(null), []);

  return { messages, sendMessage, loading, error, clearError };
}
