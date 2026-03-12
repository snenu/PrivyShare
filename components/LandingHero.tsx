"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { WalletButtons } from "./WalletButtons";

const DotLottieReact = dynamic(
  () => import("@lottiefiles/dotlottie-react").then((m) => m.DotLottieReact),
  { ssr: false }
);

const LOTTIE_BG_1 =
  "https://lottie.host/21fea06e-c526-437a-afba-64e95aa9ae06/2YNfNKp8N2.lottie";
const LOTTIE_BG_2 =
  "https://lottie.host/be543174-b62a-49b6-a42b-1f8026d808d4/LoLJoCuK56.lottie";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden border-b border-privy-gray-800 px-4 py-20 sm:py-28 md:py-32 min-h-[520px] sm:min-h-[580px] flex items-center">
      {/* Full background layer 1 - geometric shapes */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 opacity-[0.15]">
          <DotLottieReact
            src={LOTTIE_BG_1}
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
      {/* Full background layer 2 - blended overlay */}
      <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
        <div className="absolute inset-0 opacity-[0.12]">
          <DotLottieReact
            src={LOTTIE_BG_2}
            loop
            autoplay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
      {/* Gradient overlay - blends Lotties into background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-privy-black/70 via-privy-black/40 to-privy-black/80" />
      <div className="relative z-10 mx-auto max-w-6xl w-full flex flex-col lg:flex-row lg:items-center lg:justify-between gap-12 lg:gap-16">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-xs sm:text-sm font-semibold text-privy-gray-400 uppercase tracking-[0.2em] mb-4 sm:mb-5"
          >
            Decentralized file sharing on Aleo
          </motion.p>
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight text-privy-white leading-[1.1]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            Encrypt. Share.{" "}
            <span className="bg-gradient-to-r from-privy-white to-privy-gray-400 bg-clip-text text-transparent">
              Monetize.
            </span>
          </motion.h1>
          <motion.p
            className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-privy-gray-400 leading-relaxed max-w-xl"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Upload files with client-side encryption. Share via QR code or link. Accept payments privately. Your wallet is your identity—no signup required.
          </motion.p>
          <motion.div
            className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <WalletButtons />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
