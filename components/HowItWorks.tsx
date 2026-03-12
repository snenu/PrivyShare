"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const steps = [
  {
    title: "Upload & encrypt",
    body: "Your file is encrypted on your device before upload. Only you hold the key. Share via QR or link.",
    icon: "/lock-badge.svg",
  },
  {
    title: "List & share",
    body: "Set your price. Get a shareable link and QR code. Anyone can scan, visit, and pay—no account needed to view.",
    icon: "/file-badge.svg",
  },
  {
    title: "Private purchase",
    body: "Buyer connects wallet, pays you. You grant access. They download with the decryption key you share.",
    icon: "/lock-badge.svg",
  },
];

export function HowItWorks() {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 border-b border-privy-gray-800">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-privy-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          How it works
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-privy-gray-400 max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Each user has their own dashboard. Connect wallet = login. Share files with anyone.
        </motion.p>
        <div className="mt-12 sm:mt-16 grid gap-6 sm:gap-8 md:grid-cols-3">
          {steps.map((item, i) => (
            <motion.div
              key={item.title}
              className="rounded-2xl border border-privy-gray-800 bg-privy-gray-900/60 p-8 flex flex-col items-center text-center group hover:border-privy-gray-700 transition-colors"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, type: "spring", stiffness: 100 }}
              whileHover={{ y: -6 }}
            >
              <motion.div
                className="mb-6 h-16 w-16 rounded-2xl bg-privy-gray-800/80 flex items-center justify-center opacity-90 group-hover:opacity-100"
                whileHover={{ rotate: 5, scale: 1.05 }}
              >
                <Image src={item.icon} alt="" width={32} height={32} />
              </motion.div>
              <h3 className="font-semibold text-xl text-privy-white">{item.title}</h3>
              <p className="mt-4 text-privy-gray-400 leading-relaxed">{item.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
