import { useState, cloneElement, isValidElement } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({
  children,
  reviewHistory = [],
  onSelectReview,
  onNewReview,
  onDeleteReview,
  onRenameReview,
  currentReviewId,
  reviewStateRef,
  onReviewsRefetch,
  selectedReviewId,
  saveError,
  clearSaveError,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const child = isValidElement(children)
    ? cloneElement(children, {
        reviewStateRef,
        onReviewsRefetch,
        selectedReviewId,
      })
    : children;

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        reviewHistory={reviewHistory}
        onSelectReview={onSelectReview}
        onNewReview={onNewReview}
        onDeleteReview={onDeleteReview}
        onRenameReview={onRenameReview}
        currentReviewId={currentReviewId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        saveError={saveError}
        clearSaveError={clearSaveError}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className="flex min-h-0 flex-1 flex-col">{child}</main>
      </div>
    </div>
  );
}
