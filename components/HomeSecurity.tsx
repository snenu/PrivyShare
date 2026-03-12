"use client";

import { motion } from "framer-motion";

const points = [
  "Files are encrypted on your device before upload—only you hold the key.",
  "Ownership and payments are recorded on Aleo with zero-knowledge proofs.",
  "No one can see what you upload, who buys, or how much was paid.",
];

export function HomeSecurity() {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 border-t border-privy-gray-800">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-privy-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Security by design
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-privy-gray-400 max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          PrivyShare uses client-side encryption and Aleo&apos;s privacy-preserving blockchain to keep your data and transactions confidential.
        </motion.p>
        <ul className="mt-6 space-y-3">
          {points.map((point, i) => (
            <motion.li
              key={point}
              className="flex items-start gap-3 text-privy-gray-300"
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
            >
              <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
              <span>{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
