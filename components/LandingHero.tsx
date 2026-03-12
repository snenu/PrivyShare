"use client";

import { motion } from "framer-motion";
import { WalletButtons } from "./WalletButtons";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-privy-gray-800 px-4 py-24 md:py-32">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <img src="/lock-badge.svg" alt="" className="absolute top-20 left-10 w-12 h-12 opacity-20" />
        <img src="/file-badge.svg" alt="" className="absolute top-32 right-16 w-14 h-14 opacity-15" />
        <img src="/file-badge.svg" alt="" className="absolute bottom-24 left-1/4 w-10 h-10 opacity-10" />
      </div>
      <div className="mx-auto max-w-3xl text-center">
        <motion.h1
          className="text-4xl font-bold tracking-tight md:text-5xl"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Private file sharing where ownership, payments, and access stay confidential.
        </motion.h1>
        <motion.p
          className="mt-6 text-lg text-privy-gray-400"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          PrivyShare is a privacy-preserving decentralized file sharing and monetization platform built on Aleo using zero-knowledge cryptography.
        </motion.p>
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <WalletButtons />
        </motion.div>
      </div>
    </section>
  );
}
