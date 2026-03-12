"use client";

import { motion } from "framer-motion";

const stats = [
  { label: "Client-side encryption", value: "AES-GCM" },
  { label: "Storage", value: "IPFS" },
  { label: "Payments", value: "Aleo" },
];

export function HomeStats() {
  return (
    <section className="px-4 sm:px-6 py-16 sm:py-20 border-b border-privy-gray-800">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="rounded-2xl border border-privy-gray-800 bg-privy-gray-900/50 py-8 px-6 text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <p className="text-2xl md:text-3xl font-bold text-privy-white">{s.value}</p>
              <p className="mt-2 text-sm text-privy-gray-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
