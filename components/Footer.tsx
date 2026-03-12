"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-privy-gray-800 px-4 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <p className="text-sm text-privy-gray-500">
          Files on IPFS · Ownership & payments on Aleo Testnet
        </p>
        <div className="flex gap-6">
          <Link href="/marketplace" className="text-sm text-privy-gray-500 hover:text-privy-white">
            Marketplace
          </Link>
          <Link href="/upload" className="text-sm text-privy-gray-500 hover:text-privy-white">
            Upload
          </Link>
          <Link href="/dashboard" className="text-sm text-privy-gray-500 hover:text-privy-white">
            Dashboard
          </Link>
        </div>
      </div>
    </footer>
  );
}
