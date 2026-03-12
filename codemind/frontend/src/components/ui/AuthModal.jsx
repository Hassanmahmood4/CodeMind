import { useEffect } from 'react';
import { SignIn, SignUp } from '@clerk/react';
import { X } from 'lucide-react';
import { useAuthModal } from '../../contexts/AuthModalContext';

const clerkAppearance = {
  variables: {
    colorBackground: '#262626',
    colorInputBackground: '#404040',
    colorInputText: '#fafafa',
    colorText: '#d4d4d4',
    colorTextSecondary: '#a3a3a3',
    colorPrimary: '#fafafa',
    borderRadius: '0.75rem',
  },
  elements: {
    rootBox: 'w-full max-w-sm mx-auto',
    card: 'shadow-none bg-transparent',
    cardBox: 'w-full space-y-6',
    headerTitle: 'text-white text-xl font-semibold',
    headerSubtitle: 'text-neutral-400',
    formFieldLabel: 'text-neutral-300 font-medium',
    formFieldInput:
      'bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-500 focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600',
    socialButtonsBlockButton:
      'bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white flex items-center justify-center gap-3',
    socialButtonsBlockButtonText: 'text-white font-medium',
    dividerLine: 'bg-neutral-700',
    dividerText: 'text-neutral-400',
    footerActionText: 'text-neutral-400',
    footerActionLink: 'text-white hover:text-neutral-200',
    formButtonPrimary: 'bg-white text-black hover:bg-neutral-200 font-medium',
  },
};

export default function AuthModal() {
  const { isOpen, tab, setTab, closeAuthModal } = useAuthModal();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div
        className="absolute inset-0"
        onClick={closeAuthModal}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md mx-auto h-auto max-h-[90vh] overflow-hidden flex flex-col rounded-xl bg-neutral-900 border border-neutral-800 shadow-xl shadow-black/40 animate-modal-in auth-modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        <style>{`
          .auth-modal-container span.cl-socialButtonsProviderIcon,
          .auth-modal-container .cl-socialButtonsProviderIcon {
            color: rgba(255, 255, 255, 0.62);
          }
          .auth-modal-container [class*="socialButtonsBlock"] > * {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
          }
          .auth-modal-container [class*="socialButtonsBlock"] > * > *:first-child {
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            visibility: hidden;
            overflow: hidden;
            margin: 0;
          }
          .auth-modal-container [class*="socialButtonsBlock"] > *::before {
            content: '';
            display: block;
            width: 20px;
            height: 20px;
            flex-shrink: 0;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }
          .auth-modal-container [class*="socialButtonsBlock"] > *:nth-child(1)::before {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M16.365 1.43c0 1.14-.464 2.208-1.25 3.015-.84.86-2.21 1.52-3.385 1.42-.15-1.14.48-2.25 1.26-3.06.84-.86 2.27-1.49 3.375-1.375zM20.5 17.5c-.59 1.33-.86 1.92-1.62 3.12-1.05 1.66-2.54 3.73-4.39 3.75-1.65.02-2.08-1.06-4.34-1.05-2.26.01-2.73 1.07-4.38 1.05-1.85-.02-3.27-1.9-4.32-3.55-2.94-4.63-3.25-10.06-1.43-12.93 1.3-2.07 3.35-3.29 5.28-3.29 1.96 0 3.2 1.08 4.82 1.08 1.57 0 2.53-1.08 4.8-1.08 1.72 0 3.54.93 4.83 2.54-4.25 2.33-3.56 8.37.73 10.36z'/%3E%3C/svg%3E");
          }
          .auth-modal-container [class*="socialButtonsBlock"] > *:nth-child(2)::before {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.38.6.1.82-.26.82-.57v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.38-1.34-1.74-1.34-1.74-1.1-.75.08-.73.08-.73 1.21.08 1.85 1.24 1.85 1.24 1.08 1.85 2.83 1.32 3.52 1 .11-.78.42-1.32.76-1.62-2.66-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.49 5.92.43.37.81 1.1.81 2.22v3.29c0 .31.22.68.82.57C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z'/%3E%3C/svg%3E");
          }
          .auth-modal-container [class*="socialButtonsBlock"] > *:nth-child(3)::before {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24'%3E%3Cpath fill='%234285F4' d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'/%3E%3Cpath fill='%2334A853' d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'/%3E%3Cpath fill='%23FBBC05' d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'/%3E%3Cpath fill='%23EA4335' d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'/%3E%3C/svg%3E");
          }
        `}</style>
        <div className="flex-none px-6 pt-8 pb-2 pr-14">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 z-10 rounded-lg p-1.5 text-neutral-400 transition-colors hover:text-white hover:bg-neutral-800"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex gap-2 rounded-lg bg-neutral-800 p-1">
            <button
              type="button"
              onClick={() => setTab('sign-in')}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === 'sign-in'
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setTab('sign-up')}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === 'sign-up'
                  ? 'bg-neutral-700 text-white'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Sign up
            </button>
          </div>
        </div>

        <div id="auth-modal-title" className="sr-only">
          {tab === 'sign-in' ? 'Sign in' : 'Sign up'}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="w-full flex justify-center px-6 py-8 space-y-6">
            <div className="w-full max-w-sm mx-auto">
              {tab === 'sign-in' ? (
                <SignIn
                  key="signin"
                  appearance={clerkAppearance}
                  afterSignInUrl="/review"
                />
              ) : (
                <SignUp
                  key="signup"
                  appearance={clerkAppearance}
                  afterSignUpUrl="/review"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
