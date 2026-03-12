"use client";

import { motion } from "framer-motion";

const steps = [
  {
    title: "Encrypt & upload",
    body: "Files are encrypted on your device, then stored on IPFS. Only you control the key.",
    icon: "/lock-badge.svg",
  },
  {
    title: "List on Aleo",
    body: "Ownership and listing are recorded on Aleo with private state. Set your price.",
    icon: "/file-badge.svg",
  },
  {
    title: "Private purchase & access",
    body: "Buyers pay privately. Access is verified with ZK proofs—no identity leakage.",
    icon: "/lock-badge.svg",
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-center text-2xl font-semibold"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          How it works
        </motion.h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((item, i) => (
            <motion.div
              key={item.title}
              className="card flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="mb-4 h-12 w-12 opacity-80">
                <img src={item.icon} alt="" className="w-full h-full" />
              </div>
              <h3 className="font-medium">{item.title}</h3>
              <p className="mt-2 text-sm text-privy-gray-400">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
