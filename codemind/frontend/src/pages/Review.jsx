import { useState, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/react';
import { useReview } from '../hooks/useReview';
import { reviewRepository } from '../lib/api';
import CodeEditor from '../components/review/CodeEditor';
import ReviewPanel from '../components/review/ReviewPanel';
import ReviewInput from '../components/review/ReviewInput';
import RepoReview from '../components/review/RepoReview';
import RepoReviewPanel from '../components/review/RepoReviewPanel';
import { FileCode, Github } from 'lucide-react';
import { cn } from '../lib/utils';

const TABS = [
  { id: 'editor', label: 'Editor', icon: FileCode },
  { id: 'repository', label: 'Repository', icon: Github },
];

export default function Review() {
  const { getToken, isSignedIn } = useAuth();
  const {
    code,
    setCode,
    language,
    setLanguage,
    review,
    loading,
    error,
    submitReview,
    isSignedIn: editorSignedIn,
  } = useReview();

  const [activeTab, setActiveTab] = useState('editor');
  const [repoResult, setRepoResult] = useState(null);
  const [repoLoading, setRepoLoading] = useState(false);
  const [repoError, setRepoError] = useState(null);
  const [repoPhase, setRepoPhase] = useState('cloning');
  const phaseTimerRef = useRef(null);

  const submitRepoReview = useCallback(
    async (repoUrl) => {
      if (!isSignedIn) {
        setRepoError('Please sign in to analyze a repository.');
        return;
      }
      setRepoLoading(true);
      setRepoError(null);
      setRepoResult(null);
      setRepoPhase('cloning');

      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
      phaseTimerRef.current = setTimeout(() => setRepoPhase('analyzing'), 3000);

      try {
        const token = await getToken({ skipCache: true });
        if (!token) {
          setRepoError('Session expired or invalid. Please sign in again.');
          setRepoLoading(false);
          return;
        }
        const data = await reviewRepository(repoUrl, token);
        setRepoResult(data);
      } catch (err) {
        setRepoError(err.response?.data?.error || err.message || 'Failed to review repository');
      } finally {
        if (phaseTimerRef.current) {
          clearTimeout(phaseTimerRef.current);
          phaseTimerRef.current = null;
        }
        setRepoLoading(false);
      }
    },
    [isSignedIn, getToken]
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Tabs: Editor | Repository */}
      <div className="flex border-b border-neutral-800 bg-neutral-950">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 border-b-2 px-5 py-3.5 text-sm font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'border-white text-white'
                : 'border-transparent text-neutral-500 hover:text-neutral-300'
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Left column */}
        <div className="flex min-h-0 flex-1 flex-col border-r border-neutral-800 lg:min-w-[400px]">
          {activeTab === 'editor' ? (
            <>
              <div className="flex min-h-[280px] flex-1">
                <CodeEditor
                  value={code}
                  onChange={setCode}
                  language={language}
                  height="100%"
                  className="h-full w-full min-h-[280px]"
                />
              </div>
              <ReviewInput
                language={language}
                onLanguageChange={setLanguage}
                onSubmit={submitReview}
                loading={loading}
                disabled={!code.trim()}
                isSignedIn={editorSignedIn}
              />
            </>
          ) : (
            <RepoReview
              onSubmit={submitRepoReview}
              loading={repoLoading}
              phase={repoPhase}
              error={repoError}
              isSignedIn={!!isSignedIn}
            />
          )}
        </div>

        {/* Right column: AI Review panel */}
        <div className="flex min-h-[320px] flex-1 flex-col bg-neutral-950 lg:min-w-[360px]">
          {activeTab === 'editor' && (
            <>
              {error && (
                <div className="mx-4 mt-4 rounded-xl bg-neutral-900 border border-neutral-800 px-5 py-3 text-sm text-neutral-200 shadow-sm shadow-black/20">
                  {error}
                </div>
              )}
              <ReviewPanel review={review} loading={loading} />
            </>
          )}
          {activeTab === 'repository' && (
            <RepoReviewPanel
              repoResult={repoResult}
              loading={repoLoading}
              error={repoError}
            />
          )}
        </div>
      </div>
    </div>
  );
}
