"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { WalletMultiButton } from "@provablehq/aleo-wallet-adaptor-react-ui";

export function HomeCta() {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          className="rounded-2xl sm:rounded-3xl border border-privy-gray-800 bg-privy-gray-900/50 p-8 sm:p-12 md:p-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-2xl font-bold text-privy-white md:text-4xl"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Ready to share privately?
          </motion.h2>
          <motion.p
            className="mt-5 text-lg text-privy-gray-400"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Connect your wallet to get started. Browse the marketplace or upload your first file.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <WalletMultiButton />
            <Link href="/marketplace" className="btn-secondary text-base px-6 py-3">
              Browse marketplace
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
