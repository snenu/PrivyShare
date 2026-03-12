"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";
import { listFiles } from "@/lib/aleo/programState";
import type { FileInfo } from "@/lib/aleo/programState";

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
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-privy-gray-400">Connect your wallet to see your files.</p>
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
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold">My Files</h1>
        <p className="mt-1 text-sm text-privy-gray-400">Files you uploaded and own.</p>
        <Link href="/upload" className="btn-primary mt-4 inline-block">
          Upload file
        </Link>
        {loading && <p className="mt-6 text-privy-gray-400">Loading...</p>}
        {!loading && files.length === 0 && (
          <p className="mt-6 text-privy-gray-400">You have not uploaded any files yet.</p>
        )}
        {!loading && files.length > 0 && (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map(({ fileId, info }) => (
              <li key={fileId}>
                <Link
                  href={`/files/${fileId}`}
                  className="card block transition hover:border-privy-gray-600"
                >
                  <span className="font-mono text-xs text-privy-gray-500">#{fileId}</span>
                  <p className="mt-1 font-medium">File {fileId}</p>
                  <p className="mt-1 text-sm text-privy-gray-400">
                    Price: {info.price} credits
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
