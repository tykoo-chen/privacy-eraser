import type { Metadata } from "next";
import { EB_Garamond, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const garamond = EB_Garamond({ variable: "--font-serif", subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const plexMono = IBM_Plex_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });

export const metadata: Metadata = {
  title: "ErasePAST — 个人公关 Agent",
  description: "像明星经纪人一样管理你的数字身份",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`${garamond.variable} ${plexMono.variable} antialiased bg-[var(--paper)] text-[var(--ink)]`}>
        <nav className="border-b border-[var(--border-faint)] sticky top-0 z-50 bg-[var(--paper)]/90 backdrop-blur-sm">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between h-12 px-8">
            <Link href="/" className="font-[family-name:var(--font-serif)] text-[18px] tracking-[-0.02em] hover:opacity-60 transition-opacity">
              ErasePAST
            </Link>
            <div className="flex items-center font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.05em]">
              {[
                { href: "/", label: "首页" },
                { href: "/architecture", label: "架构" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-[var(--ink-light)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-all px-3 py-1">
                  {l.label}
                </Link>
              ))}
              <a href="https://github.com/tykoo-chen/erase-past" target="_blank" rel="noopener" className="text-[var(--ink-light)] hover:bg-[var(--ink)] hover:text-[var(--paper)] transition-all px-3 py-1">
                GitHub ↗
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
