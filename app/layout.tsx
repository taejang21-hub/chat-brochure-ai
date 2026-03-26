import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  icons: {
    icon: "/favicon.png",
  },
  title: "챗브로슈어AI",
  description: "AI로 브로슈어 초안과 사업 스토리를 만들고, 상담까지 연결하는 서비스",

  openGraph: {
    title: "챗브로슈어AI",
    description:
      "AI로 브로슈어 초안, 회사소개서, 사업 전략까지 한 번에 정리하고 바로 상담으로 연결하세요.",
    url: "https://chat-brochure-ai.vercel.app",
    siteName: "챗브로슈어AI",
    images: [
      {
        url: "https://chat-brochure-ai.vercel.app/og.png", // 👈 중요
        width: 1200,
        height: 630,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "챗브로슈어AI",
    description:
      "브로슈어 제작 전, AI로 사업 스토리와 전략을 먼저 완성하세요.",
    images: ["https://chat-brochure-ai.vercel.app/og.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}