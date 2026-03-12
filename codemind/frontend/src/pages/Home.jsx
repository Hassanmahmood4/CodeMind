import { Link } from 'react-router-dom';
import { FileCode } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="max-w-lg text-center">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">AI Code Reviewer</h1>
        <p className="mt-3 text-zinc-400">
          Paste or type your code and get structured AI feedback—problems, suggestions, and fixes.
        </p>
        <Link
          to="/review"
          className="mt-8 inline-flex items-center gap-2 rounded-xl bg-cyan-600 px-6 py-3 font-medium text-white transition-colors hover:bg-cyan-500"
        >
          <FileCode className="h-5 w-5" />
          Start Review
        </Link>
      </div>
    </div>
  );
}
