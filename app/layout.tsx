import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "המתכונים שלנו",
  description: "אוסף המתכונים המשפחתי שלנו",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
