"use client";

import Link from "next/link";
import CodeMindLogo from "@/components/CodemindLogo";
import { Github, Mail, Twitter, Linkedin } from "lucide-react";

const productLinks = [
  { label: "New review", href: "/review" },
  { label: "Dashboard", href: "/dashboard" },
  { label: "Log in", href: "/login" },
  { label: "Sign up", href: "/register" },
];

const social = [
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#111827] py-14 sm:py-16 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-xs">
            <CodeMindLogo size="sm" theme="dark" className="mb-4" />
            <p className="mb-6 text-sm text-white/60">
              AI-powered code review for bugs, security, and performance.
            </p>
            <div className="flex gap-4">
              {social.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-white/50 transition-all hover:bg-white/5 hover:text-cyan-400"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
          <div className="grid gap-10 sm:flex sm:gap-16">
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Product</h4>
              <ul className="space-y-3">
                {productLinks.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-white/60 transition-colors hover:text-cyan-400"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-sm font-semibold text-white">Connect</h4>
              <ul className="space-y-3">
                <li>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-cyan-400"
                  >
                    <Github className="h-4 w-4" />
                    GitHub
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-cyan-400"
                  >
                    <Mail className="h-4 w-4" />
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-sm text-white/50">
          © {year} CodeMind. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
