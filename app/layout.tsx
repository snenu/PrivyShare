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

// Validate environment variables at module load time
const envResult = validateEnv();
if (!envResult.ok) {
  const msg = `Missing required environment variables: ${envResult.missing.join(", ")}. Set them in .env.local or deployment config.`;
  if (process.env.NODE_ENV === "production") {
    console.error("❌", msg);
  } else {
    console.warn("⚠️", msg);
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
