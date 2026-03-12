"use client";

import Link from "next/link";
import { WalletMultiButton } from "@provablehq/aleo-wallet-adaptor-react-ui";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";

export function Header() {
  const { connected, isTestnet } = usePrivyWallet();
  return (
    <header className="border-b border-privy-gray-800">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <img src="/lock-badge.svg" alt="" className="h-6 w-6 opacity-80" />
          PrivyShare
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/marketplace"
            className="text-sm text-privy-gray-400 hover:text-privy-white transition-colors"
          >
            Explore Files
          </Link>
<Link
              href="/upload"
              className="text-sm text-privy-gray-400 hover:text-privy-white transition-colors"
            >
              Upload
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-privy-gray-400 hover:text-privy-white transition-colors"
            >
              Dashboard
            </Link>
            {connected && !isTestnet && (
              <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                Wrong network
              </span>
            )}
            <WalletMultiButton />
        </nav>
      </div>
    </header>
  );
}
