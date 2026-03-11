"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import CodeMindLogo from "@/components/CodemindLogo";

const navLinks = [
  { label: "Products", href: "#" },
  { label: "Resources", href: "#" },
  { label: "Solutions", href: "#" },
  { label: "Pricing", href: "#" },
];

export default function Navbar() {
  const { user, isReady } = useAuth();

  return (
    <header className="fixed top-0 left-0 z-50 h-16 w-full overflow-visible border-b border-white/10 bg-[#0B0F19]">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        {/* Left: logo + brand + nav links */}
        <div className="flex items-center gap-8">
          <CodeMindLogo
            size="header"
            theme="dark"
            className="flex-shrink-0"
          />
          <nav className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
            {navLinks.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="transition-colors hover:text-white"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Log In, Sign Up (or Dashboard, New review when logged in) */}
        <div className="flex items-center gap-3">
          {isReady && user ? (
            <>
              <Link
                href="/dashboard"
                className="rounded-md px-4 py-2 text-sm text-gray-300 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/review"
                className="rounded-md border border-white/20 px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                New review
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex flex-col justify-center items-center rounded-md px-4 py-2 text-sm text-gray-300 transition-colors hover:text-white font-['Roboto',sans-serif]"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
