import { Show, useClerk } from '@clerk/react';
import { Link } from 'react-router-dom';

export default function Auth() {
  const { openSignIn, openSignUp } = useClerk();

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md rounded-xl bg-neutral-900 border border-neutral-800 p-8 shadow-sm shadow-black/20">
        <Show when="signed-in">
          <p className="text-center text-neutral-400">You are signed in.</p>
          <Link
            to="/review"
            className="mt-4 block text-center text-white hover:text-neutral-200 transition-colors"
          >
            Go to Review →
          </Link>
        </Show>
        <Show when="signed-out">
          <h1 className="text-xl font-semibold text-white">Welcome to CodeMind</h1>
          <p className="mt-3 text-sm text-neutral-400">Sign in or create an account to save reviews.</p>
          <div className="mt-6 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => openSignIn()}
              className="w-full rounded-xl bg-white py-3 font-medium text-black transition-all duration-200 hover:bg-zinc-100"
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => openSignUp()}
              className="w-full rounded-xl bg-neutral-800 border border-neutral-700 py-3 font-medium text-white transition-all duration-200 hover:border-neutral-600 hover:-translate-y-px"
            >
              Sign up
            </button>
          </div>
        </Show>
      </div>
    </div>
  );
}
