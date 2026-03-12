import { createContext, useContext, useCallback } from 'react';
import { useClerk } from '@clerk/react';

const AuthModalContext = createContext(null);

export function AuthModalProvider({ children }) {
  const { openSignIn, openSignUp } = useClerk();

  const openAuthModal = useCallback(
    (initialTab = 'sign-in') => {
      if (initialTab === 'sign-up') {
        openSignUp();
      } else {
        openSignIn();
      }
    },
    [openSignIn, openSignUp]
  );

  const closeAuthModal = useCallback(() => {}, []);

  return (
    <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return ctx;
}
