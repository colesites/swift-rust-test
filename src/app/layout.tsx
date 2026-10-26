import type { ReactNode } from "react";
import { Geist, GeistMono } from "swift-rust/font/google";
import { Link } from "swift-rust/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Kbd } from "@/components/ui/kbd";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: true,
});
const geistMono = GeistMono({
  subsets: ["latin"],
  display: "swap",
  variable: true,
});

export const metadata = {
  title: {
    template: "%s | Crate",
    default: "Crate",
  },
  description: "A fast, no-nonsense reading list built with swift-rust.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <header className="border-b border-border">
          <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold tracking-tight"
            >
              <span className="grid size-6 place-items-center rounded-md bg-primary text-xs text-primary-foreground">
                C
              </span>
              Crate
            </Link>
            <div className="flex items-center gap-3">
              <a
                href="/api/bookmarks"
                className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
              >
                API <Kbd>JSON</Kbd>
              </a>
              <ThemeToggle />
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6">
          {children}
        </main>
        <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          Built with swift-rust · React 19 on Rust + Bun
        </footer>
      </body>
    </html>
  );
}
