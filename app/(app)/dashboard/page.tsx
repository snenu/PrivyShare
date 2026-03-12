"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";
import { listFiles } from "@/lib/aleo/programState";
import type { FileInfo } from "@/lib/aleo/programState";
import { motion } from "framer-motion";

function loadLocalMeta(fileId: number): { name?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`privyshare_meta_${fileId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { name?: string };
    return parsed;
  } catch {
    return null;
  }
}

interface AccessRecord {
  owner: string;
  file_id: number;
  [key: string]: unknown;
}

export default function DashboardPage() {
  const { connected, address, requestRecords } = usePrivyWallet();
  const [myFiles, setMyFiles] = useState<{ fileId: number; info: FileInfo }[]>([]);
  const [purchasedCount, setPurchasedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected || !address) {
      setLoading(false);
      return;
    }
    const programId = process.env.NEXT_PUBLIC_PRIVYSHARE_PROGRAM_ID ?? "privyshare_files_7879.aleo";
    const filesPromise = listFiles().then((data) =>
      data.filter((f) => f.info.owner === address)
    );
    const purchasedPromise = requestRecords
      ? requestRecords(programId)
          .then((raw) => {
            const list = Array.isArray(raw) ? raw : [];
            return list.filter(
              (r: unknown): r is AccessRecord =>
                typeof r === "object" &&
                r !== null &&
                "owner" in r &&
                "file_id" in r &&
                (r as AccessRecord).owner === address
            ).length;
          })
          .catch(() => 0)
      : Promise.resolve(0);

    Promise.all([filesPromise, purchasedPromise])
      .then(([mine, count]) => {
        setMyFiles(mine);
        setPurchasedCount(count);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [connected, address, requestRecords]);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="rounded-2xl border border-privy-gray-800 bg-privy-gray-900/60 p-12 max-w-md">
          <h2 className="text-xl font-semibold text-privy-white">Connect your wallet</h2>
          <p className="mt-3 text-privy-gray-400">
            Connect your Aleo wallet to access your dashboard and manage files.
          </p>
          <Link href="/" className="btn-primary mt-6 inline-block">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      title: "Upload file",
      desc: "Encrypt and list a new file",
      href: "/upload",
      icon: "↑",
    },
    {
      title: "My files",
      desc: "Manage and share your uploads",
      href: "/my-files",
      icon: "📁",
    },
    {
      title: "Purchased",
      desc: "Files you have access to",
      href: "/purchased",
      icon: "✓",
    },
    {
      title: "Marketplace",
      desc: "Browse all listed files",
      href: "/marketplace",
      icon: "🛒",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome + address */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-privy-gray-800 bg-gradient-to-br from-privy-gray-900/90 to-privy-gray-900/50 p-6 md:p-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold text-privy-white">Dashboard</h1>
        <p className="mt-2 text-privy-gray-400">
          {address
            ? `${address.slice(0, 14)}...${address.slice(-10)}`
            : ""}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="rounded-xl border border-privy-gray-800 bg-privy-gray-900/60 p-5">
          <p className="text-2xl font-bold text-privy-white">
            {loading ? "—" : myFiles.length}
          </p>
          <p className="mt-1 text-sm text-privy-gray-500">My files</p>
        </div>
        <div className="rounded-xl border border-privy-gray-800 bg-privy-gray-900/60 p-5">
          <p className="text-2xl font-bold text-privy-white">
            {loading ? "—" : purchasedCount}
          </p>
          <p className="mt-1 text-sm text-privy-gray-500">Purchased</p>
        </div>
        <div className="rounded-xl border border-privy-gray-800 bg-privy-gray-900/60 p-5 col-span-2 md:col-span-2">
          <Link
            href="/upload"
            className="block text-privy-white font-medium hover:text-privy-gray-200 transition-colors"
          >
            + Upload new file →
          </Link>
          <p className="mt-1 text-sm text-privy-gray-500">Encrypt and list on-chain</p>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-lg font-semibold text-privy-white mb-4">Quick actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action, i) => (
            <Link
              key={action.href}
              href={action.href}
              className="group block rounded-xl border border-privy-gray-800 bg-privy-gray-900/60 p-5 transition-all hover:border-privy-gray-600 hover:bg-privy-gray-900/80"
            >
              <span className="text-2xl">{action.icon}</span>
              <h3 className="mt-3 font-medium text-privy-white group-hover:text-privy-gray-200">
                {action.title}
              </h3>
              <p className="mt-1 text-sm text-privy-gray-500">{action.desc}</p>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent files + create link */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-privy-white">Your files</h2>
          <Link href="/my-files" className="text-sm text-privy-gray-400 hover:text-privy-white transition-colors">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="rounded-xl border border-privy-gray-800 bg-privy-gray-900/40 p-8 text-center text-privy-gray-500">
            Loading...
          </div>
        ) : myFiles.length === 0 ? (
          <div className="rounded-xl border border-privy-gray-800 bg-privy-gray-900/40 p-8 text-center">
            <p className="text-privy-gray-400">No files yet. Upload your first file to get started.</p>
            <Link href="/upload" className="btn-primary mt-4 inline-block">
              Upload file
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myFiles.slice(0, 5).map(({ fileId, info }) => {
              const meta = loadLocalMeta(fileId);
              const name = meta?.name ?? `File #${fileId}`;
              return (
                <Link
                  key={fileId}
                  href={`/files/${fileId}`}
                  className="flex items-center justify-between rounded-xl border border-privy-gray-800 bg-privy-gray-900/60 p-4 transition-colors hover:border-privy-gray-600"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-privy-white truncate">{name}</p>
                    <p className="text-sm text-privy-gray-500">
                      #{fileId} · {info.price} credits
                    </p>
                  </div>
                  <span className="text-privy-gray-400 text-sm ml-4">Create link →</span>
                </Link>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
