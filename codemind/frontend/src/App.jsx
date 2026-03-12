import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Landing from './pages/Landing';
import Review from './pages/Review';
import Auth from './pages/Auth';
import { AuthModalProvider } from './contexts/AuthModalContext';

function App() {
  const reviewHistory = [];
  const currentReviewId = null;

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
              reviewHistory={reviewHistory}
              onSelectReview={() => {}}
              onNewReview={() => {}}
              currentReviewId={currentReviewId}
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
