import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({
  children,
  reviewHistory = [],
  onSelectReview,
  onNewReview,
  currentReviewId,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100">
      <Sidebar
        reviewHistory={reviewHistory}
        onSelectReview={onSelectReview}
        onNewReview={onNewReview}
        currentReviewId={currentReviewId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header onMenuClick={() => setSidebarOpen((o) => !o)} />
        <main className="flex min-h-0 flex-1 flex-col">{children}</main>
      </div>
    </div>
  );
}
