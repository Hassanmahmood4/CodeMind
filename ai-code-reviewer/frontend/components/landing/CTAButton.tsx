"use client";

import Link from "next/link";

type Props = {
  href: string;
  variant: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
};

export default function CTAButton({ href, variant, children, className = "" }: Props) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 min-w-[160px]";
  const primary =
    "px-7 py-4 text-base bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 text-white shadow-[0_0_24px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:scale-[1.03] active:scale-[0.98]";
  const secondary =
    "px-7 py-4 text-base border border-white/20 text-white bg-transparent hover:bg-white/5 hover:border-white/30";

  return (
    <Link href={href} className={`${base} ${variant === "primary" ? primary : secondary} ${className}`}>
      {children}
    </Link>
  );
}
