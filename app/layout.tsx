import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finance with AI",
  description:
    "Smart personal finance tracking with AI-powered natural language input",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
        {children}
      </body>
    </html>
  );
}
