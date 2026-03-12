"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";

export default function DashboardPage() {
  const { connected, address } = usePrivyWallet();

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-privy-gray-400">Connect your wallet to see your dashboard.</p>
          <Link href="/" className="btn-primary mt-4 inline-block">
            Go home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-1 text-sm text-privy-gray-400">
          {address ? `${address.slice(0, 12)}...${address.slice(-8)}` : ""}
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/my-files"
            className="card block transition hover:border-privy-gray-600"
          >
            <h2 className="font-medium">My Files</h2>
            <p className="mt-1 text-sm text-privy-gray-400">Files you uploaded</p>
          </Link>
          <Link
            href="/purchased"
            className="card block transition hover:border-privy-gray-600"
          >
            <h2 className="font-medium">Purchased</h2>
            <p className="mt-1 text-sm text-privy-gray-400">Files you have access to</p>
          </Link>
          <Link
            href="/upload"
            className="card block transition hover:border-privy-gray-600"
          >
            <h2 className="font-medium">Upload File</h2>
            <p className="mt-1 text-sm text-privy-gray-400">Encrypt and list a new file</p>
          </Link>
        </div>
        <div className="mt-8">
          <Link href="/marketplace" className="btn-secondary">
            Browse marketplace
          </Link>
        </div>
        <Footer />
      </main>
    </div>
  );
}
