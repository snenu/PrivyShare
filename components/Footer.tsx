"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";

const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false }
);

const LOTTIE_FOOTER =
  "https://lottie.host/3a656bff-5223-47f6-8d4c-d6a5318a59d0/lqtq6Ttt95.lottie";

const allFooterLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/upload", label: "Upload" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/settings", label: "Settings" },
];

export function Footer() {
  const { connected } = usePrivyWallet();
  const footerLinks = connected
    ? allFooterLinks
    : allFooterLinks.filter((l) => l.href === "/marketplace" || l.href === "/settings");
  return (
    <footer className="relative border-t border-privy-gray-800 bg-privy-gray-900/30 overflow-hidden">
      {/* Footer Lottie as full background - blended */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 w-full h-full opacity-[0.18]">
          <DotLottieReact
            src={LOTTIE_FOOTER}
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-privy-black/90 via-privy-gray-900/60 to-privy-gray-900/50" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 py-16 sm:py-20">
        {/* Content grid */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10 text-center sm:text-left">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-bold text-privy-white hover:opacity-90 transition-opacity"
            >
              <img src="/lock-badge.svg" alt="" className="h-6 w-6 opacity-90" />
              PrivyShare
            </Link>
            <p className="text-sm text-privy-gray-500 max-w-xs">
              Files on IPFS · Ownership & payments on Aleo Testnet
            </p>
          </div>
          <nav
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
            aria-label="Footer navigation"
          >
            {footerLinks.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium text-privy-gray-500 hover:text-privy-white transition-colors"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>

        <motion.div
          className="mt-10 pt-8 border-t border-privy-gray-800 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-xs text-privy-gray-600">
            Private file sharing on Aleo. Encrypt, share, monetize.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
