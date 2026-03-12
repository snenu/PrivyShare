"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FileCard } from "@/components/FileCard";
import { FileCardSkeleton } from "@/components/Skeleton";
import { listFiles } from "@/lib/aleo/programState";
import type { FileInfo } from "@/lib/aleo/programState";

export default function MarketplacePage() {
  const [files, setFiles] = useState<{ fileId: number; info: FileInfo }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    listFiles()
      .then((data) => {
        if (!cancelled) setFiles(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-semibold">Marketplace</h1>
        <p className="mt-1 text-sm text-privy-gray-400">Browse files listed on-chain.</p>
      </motion.div>

      {loading && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <FileCardSkeleton key={i} />
          ))}
        </ul>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 rounded-lg border border-privy-gray-700 bg-privy-gray-900/50 p-4 text-sm text-red-400"
        >
          {error}
        </motion.div>
      )}
      {!loading && !error && files.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-8 flex flex-col items-center rounded-xl border border-privy-gray-800 p-12 text-center"
        >
          <Image src="/file-badge.svg" alt="" width={64} height={64} className="mb-4 opacity-30" />
          <p className="text-privy-gray-400">No files listed yet.</p>
          <Link href="/upload" className="btn-primary mt-4">
            Upload one to get started
          </Link>
        </motion.div>
      )}
      {!loading && !error && files.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map(({ fileId, info }, i) => (
            <FileCard
              key={fileId}
              fileId={fileId}
              price={info.price}
              owner={info.owner}
              index={i}
            />
          ))}
        </ul>
      )}
    </>
  );
}
