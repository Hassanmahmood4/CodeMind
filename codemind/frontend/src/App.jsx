import { useState, useRef, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '@clerk/react';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Review from './pages/Review';
import Auth from './pages/Auth';
import { AuthModalProvider } from './contexts/AuthModalContext';
import { getReviews, saveReview, deleteReview, renameReview } from './lib/api';

function App() {
  const { getToken, isSignedIn } = useAuth();
  const location = useLocation();
  const [reviewHistory, setReviewHistory] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [reviewKey, setReviewKey] = useState(0);
  const [saveError, setSaveError] = useState(null);
  const reviewStateRef = useRef({ code: '', language: 'javascript', review: null });

  const fetchReviews = useCallback(async () => {
    if (!isSignedIn) return;
    try {
      const token = await getToken();
      if (!token) return;
      const list = await getReviews(token);
      setReviewHistory(Array.isArray(list) ? list : []);
    } catch (err) {
      console.warn('Failed to fetch review history:', err);
      setReviewHistory([]);
    }
  }, [isSignedIn, getToken]);

  useEffect(() => {
    if (location.pathname === '/review' && isSignedIn) {
      fetchReviews();
    }
  }, [location.pathname, isSignedIn, fetchReviews]);

  const handleNewReview = useCallback(async () => {
    const state = reviewStateRef.current;
    const hasContent = (state.code && state.code.trim()) || state.review;
    if (isSignedIn && hasContent) {
      try {
        const token = await getToken();
        if (token) {
          const title = (state.code?.trim().slice(0, 50) || 'Review').replace(/\n/g, ' ');
          const created = await saveReview(
            {
              title,
              code: state.code || '',
              language: state.language || 'javascript',
              reviewResult: state.review || '',
            },
            token
          );
          if (created && created.id) {
            setReviewHistory((prev) => [
              { id: created.id, title: created.title || title, createdAt: created.createdAt },
              ...prev,
            ]);
          }
          setSaveError(null);
          await fetchReviews();
        }
      } catch (e) {
        console.warn('Save before new review:', e);
        setSaveError(e.response?.data?.error || e.message || 'Failed to save');
      }
    } else {
      setSaveError(null);
    }
    setSelectedReviewId(null);
    setReviewKey((k) => k + 1);
  }, [isSignedIn, getToken, fetchReviews]);

  const handleDeleteReview = useCallback(
    async (id) => {
      if (!isSignedIn) return;
      try {
        const token = await getToken();
        if (!token) return;
        await deleteReview(id, token);
        if (selectedReviewId === id) setSelectedReviewId(null);
        await fetchReviews();
      } catch (e) {
        console.warn('Delete review failed:', e);
      }
    },
    [isSignedIn, getToken, fetchReviews, selectedReviewId]
  );

  const handleRenameReview = useCallback(
    async (id, title) => {
      if (!isSignedIn) return;
      const t = typeof title === 'string' ? title.trim() : '';
      if (!t) return;
      try {
        const token = await getToken();
        if (!token) return;
        await renameReview(id, t, token);
        setReviewHistory((prev) => prev.map((x) => (x.id === id ? { ...x, title: t } : x)));
        await fetchReviews();
      } catch (e) {
        console.warn('Rename review failed:', e);
      }
    },
    [isSignedIn, getToken, fetchReviews]
  );

  return (
    <AuthModalProvider>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/auth"
          element={
            <div className="min-h-screen">
              <Auth />
            </div>
          }
        />
        <Route
          path="/review"
          element={
            <AppLayout
              key={reviewKey}
              reviewHistory={reviewHistory}
              onSelectReview={setSelectedReviewId}
              onNewReview={handleNewReview}
              onDeleteReview={handleDeleteReview}
              onRenameReview={handleRenameReview}
              currentReviewId={selectedReviewId}
              reviewStateRef={reviewStateRef}
              onReviewsRefetch={fetchReviews}
              selectedReviewId={selectedReviewId}
              saveError={saveError}
              clearSaveError={() => setSaveError(null)}
            >
              <Review />
            </AppLayout>
          }
        />
      </Routes>
      </div>
    </AuthModalProvider>
  );
}

export default App;
