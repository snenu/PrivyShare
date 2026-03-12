"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const features = [
  {
    title: "Wallet as login",
    desc: "Connect your Aleo wallet. No email, no password. Your address is your identity and is stored securely.",
    href: "/dashboard",
  },
  {
    title: "Share by QR or link",
    desc: "Every file gets a unique link and QR code. Anyone scans → visits → pays → downloads. No account needed to view.",
    href: "/upload",
  },
  {
    title: "Your data, your dashboard",
    desc: "Files, purchases, and settings—all tied to your wallet. Fully independent. Data isolated per user.",
    href: "/my-files",
  },
];

export function HomeFeatures() {
  return (
    <section className="px-4 sm:px-6 py-20 sm:py-28 border-t border-privy-gray-800">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-privy-white"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Built for individual creators
        </motion.h2>
        <motion.p
          className="mt-4 text-lg text-privy-gray-400 max-w-2xl"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Every user is treated independently. Upload, share, and earn—all from your own space. Your data stays yours.
        </motion.p>
        <div className="mt-12 sm:mt-16 grid gap-4 sm:gap-6 md:grid-cols-3">
          {features.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={item.href}
                className="group block rounded-2xl border border-privy-gray-800 bg-privy-gray-900/60 p-8 transition-all hover:border-privy-gray-600 hover:bg-privy-gray-900/80"
              >
                <h3 className="font-semibold text-xl text-privy-white">{item.title}</h3>
                <p className="mt-3 text-privy-gray-400 leading-relaxed">{item.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-privy-gray-300 group-hover:text-privy-white transition-colors">
                  Learn more
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
