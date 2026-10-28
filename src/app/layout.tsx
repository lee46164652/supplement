import type { Metadata } from "next";
import Link from "next/link";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "영양제 궁금증 가이드",
  description: "영양제를 살 때 생기는 궁금증, 어떤 정보를 어디서 찾아야 하는지 알려드립니다.",
};

const nav = [
  { href: "/", label: "질문 찾기" },
  { href: "/assessment", label: "영양 평가" },
  { href: "/my", label: "내 리포트" },
  { href: "/compare", label: "제품 비교" },
  { href: "/ingredients", label: "성분 정보" },
  { href: "/sources", label: "정보처" },
  { href: "/checklist", label: "체크리스트" },
];

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-4">
            <Link href="/" className="text-lg font-bold">
              <span className="text-accent">💊 영양제</span> 궁금증 가이드
            </Link>
            <nav className="flex flex-wrap gap-1 text-sm">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-full px-3 py-1.5 text-muted hover:bg-accent-soft hover:text-accent"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">{children}</main>
        <footer className="border-t border-border py-6 text-center text-xs leading-relaxed text-muted">
          <p>이 사이트는 정보를 찾는 방법을 안내하며, 의학적 진단·처방을 대신하지 않습니다.</p>
          <p>복용 중인 약이 있거나 지병·임신 중이라면 반드시 약사·의사와 상담하세요.</p>
        </footer>
      </body>
    </html>
  );
}
