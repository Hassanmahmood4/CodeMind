"use client";

import Link from "next/link";

type Props = { className?: string; size?: "sm" | "md" | "lg"; showTagline?: boolean };

const fontSizes = { sm: 18, md: 22, lg: 28 };

export default function CodemindLogo({ className = "", size = "md", showTagline = false }: Props) {
  const px = fontSizes[size];
  return (
    <Link
      href="/"
      className={`inline-flex items-baseline no-underline ${className}`}
      style={{ color: "inherit" }}
    >
      <span
        className="font-rounded font-bold whitespace-nowrap"
        style={{ fontSize: `${px}px`, lineHeight: 1 }}
      >
        <span className="text-codemind-white">c</span>
        <span className="text-codemind-lime">&lt;&gt;</span>
        <span className="text-codemind-white">demind</span>
      </span>
      {showTagline && (
        <span className="ml-3 text-sm font-medium text-codemind-muted hidden sm:inline self-center">AI Code Review</span>
      )}
    </Link>
  );
}
