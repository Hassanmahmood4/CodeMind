import { useState, useRef, useEffect } from 'react';
import { Show } from '@clerk/react';
import { FileCode, MessageSquare, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuthModal } from '../../contexts/AuthModalContext';

export default function Sidebar({
  reviewHistory,
  onSelectReview,
  onNewReview,
  onDeleteReview,
  onRenameReview,
  currentReviewId,
  isOpen,
  onClose,
  saveError,
  clearSaveError,
}) {
  const { openAuthModal } = useAuthModal();
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleRenameClick = (e, item) => {
    e.stopPropagation();
    setOpenMenuId(null);
    setEditingId(item.id);
    setEditingValue(item.title || 'Review');
  };

  const saveRename = (id) => {
    const t = editingValue.trim();
    if (t && typeof onRenameReview === 'function') onRenameReview(id, t);
    setEditingId(null);
  };

  const handleDeleteClick = (e, item) => {
    e.stopPropagation();
    setOpenMenuId(null);
    if (editingId === item.id) setEditingId(null);
    if (typeof onDeleteReview === 'function') onDeleteReview(item.id);
  };

  const handleNewReviewClick = async (e) => {
    e.preventDefault();
    if (typeof onNewReview === 'function') {
      await onNewReview();
    }
    navigate('/review');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-800 bg-neutral-950 shadow-xl shadow-black/20 transition-transform duration-200 ease-out md:static md:translate-x-0 md:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col gap-1 border-b border-neutral-800 px-3 py-3">
          <Show when="signed-out">
            <div className="rounded-lg bg-neutral-800 border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-200">
              Guest Mode
            </div>
            <p className="px-2 text-xs text-neutral-500 leading-relaxed">Sign in to save reviews</p>
          </Show>
        </div>

        <Link
          to="/review"
          onClick={handleNewReviewClick}
          className="mx-3 mt-3 flex items-center gap-2 rounded-xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 text-sm text-neutral-300 transition-all duration-200 hover:border-neutral-700 hover:-translate-y-px hover:text-white"
        >
          <FileCode className="h-4 w-4" />
          New Review
        </Link>

        <div className="flex-1 overflow-y-auto p-2">
          {saveError && (
            <div className="mx-2 mb-2 rounded-lg bg-amber-950/60 border border-amber-800 px-3 py-2 text-xs text-amber-200">
              <p>{saveError}</p>
              {clearSaveError && (
                <button type="button" onClick={clearSaveError} className="mt-1 text-amber-400 hover:underline">
                  Dismiss
                </button>
              )}
            </div>
          )}
          <p className="px-2 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
            Recent reviews
          </p>
          {!reviewHistory?.length ? (
            <p className="px-2 py-4 text-sm text-zinc-500">No reviews yet</p>
          ) : (
            <ul className="space-y-0.5">
              {reviewHistory.map((item) => (
                <li key={item.id} className="group flex items-center gap-0 rounded-lg">
                  {editingId === item.id ? (
                    <>
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={() => saveRename(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(item.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="min-w-0 flex-1 rounded-lg border-0 bg-neutral-800 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-neutral-600"
                        autoFocus
                      />
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onSelectReview(item.id)}
                      className={cn(
                        'flex min-w-0 flex-1 items-center gap-2 rounded-l-lg px-3 py-2.5 text-left text-sm transition-all duration-200',
                        currentReviewId === item.id
                          ? 'bg-neutral-800 text-white'
                          : 'text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200'
                      )}
                    >
                      <MessageSquare className="h-4 w-4 shrink-0 opacity-70" />
                      <span className="truncate">{item.title || 'Review'}</span>
                    </button>
                  )}
                  {editingId !== item.id && (
                  <div className="relative shrink-0" ref={openMenuId === item.id ? menuRef : null}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId((id) => (id === item.id ? null : item.id));
                      }}
                      className={cn(
                        'rounded-r-lg p-2 text-neutral-500 transition-colors hover:bg-neutral-800 hover:text-neutral-300',
                        currentReviewId === item.id ? 'text-neutral-400' : ''
                      )}
                      title="Options"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                    {openMenuId === item.id && (
                      <div className="absolute right-0 top-full z-10 mt-0.5 min-w-[140px] rounded-xl border border-neutral-800 bg-neutral-950 py-1 shadow-xl shadow-black/30">
                        <button
                          type="button"
                          onClick={(e) => handleRenameClick(e, item)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-neutral-200 transition-colors hover:bg-neutral-800 hover:text-white"
                        >
                          <Pencil className="h-4 w-4 shrink-0 text-neutral-400" />
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteClick(e, item)}
                          className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm text-neutral-200 transition-colors hover:bg-neutral-800 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4 shrink-0 text-neutral-400" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
