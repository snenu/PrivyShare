"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";
import { QRAddress } from "@/components/QRAddress";

export default function SettingsPage() {
  const { connected, address, disconnect } = usePrivyWallet();
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (!address) return;
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-12 text-center">
          <p className="text-privy-gray-400">Connect your wallet to see settings.</p>
          <Link href="/" className="btn-primary mt-4 inline-block">
            Go home
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="text-2xl font-semibold">Wallet &amp; Settings</h1>
        <div className="card mt-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-privy-gray-400">Address</p>
            {address && (
              <button
                type="button"
                onClick={copyAddress}
                className="btn-secondary text-xs py-1.5 px-2"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          <p className="mt-1 font-mono text-sm break-all">{address ?? "—"}</p>
          {address && (
            <div className="mt-4">
              <p className="text-xs text-privy-gray-500 mb-2">Scan to receive</p>
              <QRAddress address={address} />
            </div>
          )}
        </div>
        <div className="mt-6 flex gap-4">
          <button type="button" className="btn-secondary" onClick={() => disconnect?.()}>
            Disconnect
          </button>
          <Link href="/dashboard" className="btn-primary">
            Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
