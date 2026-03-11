"use client";

import Link from "next/link";

const LOGO_DARK = "/codemind/codemind-logo-dark.svg";
const LOGO_LIGHT = "/codemind/codemind-logo-light.svg";

const SIZE_CLASSES = {
  sm: "h-8",
  md: "h-10",
  lg: "h-16",
  xl: "h-[100px]",
  /** Navbar: 120px, navbar stays h-16 */
  nav: "h-[120px] w-auto object-contain flex-shrink-0",
  /** Navbar logo-only: larger logo while header stays h-16 */
  header: "h-[180px] w-auto object-contain flex-shrink-0",
  /** Hero: 200px above headline */
  hero: "h-[200px] w-auto object-contain flex-shrink-0",
} as const;

type Theme = "dark" | "light";

type Props = {
  className?: string;
  /** sm = 32px, md = 40px, lg = 64px, xl = 100px, nav = 120px, header = 180px, hero = 200px */
  size?: "sm" | "md" | "lg" | "xl" | "nav" | "header" | "hero";
  theme?: Theme;
  /** Show logo image (set false to render link only, e.g. hero with no image) */
  showImage?: boolean;
  /** Show "CodeMind" text next to logo */
  showBrand?: boolean;
  /** Show "| AI Code Review" next to logo (e.g. navbar) */
  showTagline?: boolean;
};

export default function CodeMindLogo({
  className = "",
  size = "md",
  theme = "dark",
  showImage = true,
  showBrand = false,
  showTagline = false,
}: Props) {
  const logoSrc = theme === "dark" ? LOGO_DARK : LOGO_LIGHT;
  const logoHeightClass = SIZE_CLASSES[size];
  const pixelSize =
    size === "hero"
      ? 200
      : size === "xl"
        ? 100
        : size === "lg"
          ? 64
          : size === "nav"
            ? 120
            : size === "header"
              ? 180
              : size === "md"
                ? 40
                : 32;
  const textColor = theme === "dark" ? "text-white" : "text-gray-900";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2 no-underline ${className}`}
      style={{ color: "inherit" }}
      aria-label="CodeMind home"
    >
      {showImage && (
      <img
        src={logoSrc}
        alt="CodeMind"
        className={`shrink-0 w-auto object-contain object-center ${logoHeightClass} ${theme === "dark" ? "brightness-[1.2]" : ""}`}
        width={pixelSize}
        height={pixelSize}
        style={{ maxHeight: "none" }}
      />
      )}
      {showBrand && (
        <span className={`text-lg font-semibold ${textColor}`}>CodeMind</span>
      )}
      {showTagline && (
        <>
          <span className="text-border hidden sm:inline" aria-hidden>|</span>
          <span className="text-sm font-medium text-muted hidden sm:inline">
            AI Code Review
          </span>
        </>
      )}
    </Link>
  );
}
