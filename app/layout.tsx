import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/Providers";
import "./globals.css";

import { validateEnv } from "@/lib/env";

export const metadata: Metadata = {
  title: "PrivyShare — Private File Sharing on Aleo",
  description:
    "Private file sharing where ownership, payments, and access remain completely confidential.",
};

// Validate environment variables at module load time in development/build
if (process.env.NODE_ENV !== "production") {
  const result = validateEnv();
  if (!result.ok) {
    console.warn("⚠️ Missing required environment variables:", result.missing.join(", "));
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
