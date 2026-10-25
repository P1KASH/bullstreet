import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "BullStreet AI",
  description: "XGBoost-powered stock forecast dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-[var(--border)] bg-[var(--panel)]/60 backdrop-blur sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-sm bg-[var(--accent)]" />
              <span className="font-semibold tracking-tight">BullStreet AI</span>
            </div>
            <nav className="text-sm text-[var(--muted)]">
              <Link href="/" className="hover:text-[var(--text)] transition-colors">Dashboard</Link>
            </nav>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
