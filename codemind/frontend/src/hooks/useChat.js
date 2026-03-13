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
        let token = null;
        try {
          token = await getToken();
          if (!token) token = await getToken({ skipCache: true });
        } catch (tokenErr) {
          if (import.meta.env.DEV) {
            const { response } = await sendChatMessage(trimmed, null);
            setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
            return;
          }
          setError(tokenErr.message || 'Could not get session. Sign out and sign in again.');
          return;
        }
        if (!token) {
          if (import.meta.env.DEV) {
            const { response } = await sendChatMessage(trimmed, null);
            setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
            return;
          }
          setError('Session expired or invalid. Please sign in again.');
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
