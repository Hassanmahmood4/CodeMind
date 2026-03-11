import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const nunito = Nunito({ subsets: ["latin"], variable: "--font-rounded", weight: ["400", "700"] });

export const metadata: Metadata = {
  title: "CodeMind – AI Code Review",
  description: "CodeMind: AI-powered code review for bugs, security, performance, and readability.",
  icons: {
    icon: "/codemind/codemind-icon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} ${nunito.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
