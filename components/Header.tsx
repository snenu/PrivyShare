"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { WalletMultiButton } from "@provablehq/aleo-wallet-adaptor-react-ui";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const { connected, isTestnet } = usePrivyWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/marketplace", label: "Browse marketplace" },
    ...(connected
      ? [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/upload", label: "Upload" },
          { href: "/my-files", label: "My Files" },
          { href: "/purchased", label: "Purchased" },
          { href: "/settings", label: "Settings" },
        ]
      : []),
  ];

  return (
    <header className="border-b border-privy-gray-800 bg-privy-black/90 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-tight hover:opacity-90 transition-opacity"
        >
          <Image src="/lock-badge.svg" alt="" width={28} height={28} className="opacity-90" />
          PrivyShare
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-privy-gray-400 hover:text-privy-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {connected && !isTestnet && (
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
              Wrong network
            </span>
          )}
          <WalletMultiButton />
        </nav>

        {/* Mobile: hamburger + wallet */}
        <div className="flex md:hidden items-center gap-3">
          <WalletMultiButton />
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="p-2 rounded-lg text-privy-gray-400 hover:text-privy-white hover:bg-privy-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-privy-gray-800 bg-privy-black/95 backdrop-blur-md"
          >
            <nav className="flex flex-col py-4 px-4 gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 px-4 rounded-lg text-privy-gray-400 hover:text-privy-white hover:bg-privy-gray-800 transition-colors font-medium"
                >
                  {link.label}
                </Link>
              ))}
              {connected && !isTestnet && (
                <div className="py-3 px-4">
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                    Wrong network
                  </span>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
