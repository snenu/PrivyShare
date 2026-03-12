"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";
import { listFiles } from "@/lib/aleo/programState";
import type { FileInfo } from "@/lib/aleo/programState";
import { formatPrice } from "@/lib/formatPrice";
import { FileCardSkeleton } from "@/components/Skeleton";

function loadLocalMeta(fileId: number): { name?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`privyshare_meta_${fileId}`);
    if (!raw) return null;
    return JSON.parse(raw) as { name?: string };
  } catch {
    return null;
  }
}

export default function MyFilesPage() {
  const { connected, address } = usePrivyWallet();
  const [files, setFiles] = useState<{ fileId: number; info: FileInfo }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected) {
      setLoading(false);
      return;
    }
    listFiles()
      .then((data) => {
        const mine = data.filter((f) => f.info.owner === address);
        setFiles(mine);
      })
      .catch(() => setFiles([]))
      .finally(() => setLoading(false));
  }, [connected, address]);

  if (!connected) {
    return (
      <div className="text-center py-12">
        <p className="text-privy-gray-400">Connect your wallet to see your files.</p>
        <Link href="/" className="btn-primary mt-4 inline-block">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">My Files</h1>
      <p className="mt-1 text-sm text-privy-gray-400">Files you uploaded and own.</p>
      <Link href="/upload" className="btn-primary mt-4 inline-block">
        Upload file
      </Link>
      {loading && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <FileCardSkeleton key={i} />
          ))}
        </ul>
      )}
      {!loading && files.length === 0 && (
        <p className="mt-6 text-privy-gray-400">You have not uploaded any files yet.</p>
      )}
      {!loading && files.length > 0 && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {files.map(({ fileId, info }) => {
            const meta = loadLocalMeta(fileId);
            const name = meta?.name ?? `File ${fileId}`;
            return (
              <li key={fileId}>
                <Link
                  href={`/files/${fileId}`}
                  className="card block transition hover:border-privy-gray-600"
                >
                  <span className="font-mono text-xs text-privy-gray-500">#{fileId}</span>
                  <p className="mt-1 font-medium">{name}</p>
                  <p className="mt-1 text-sm text-privy-gray-400">
                    Price: {formatPrice(info.price)}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
