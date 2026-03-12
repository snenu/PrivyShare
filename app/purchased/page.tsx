"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";

interface AccessRecord {
  owner: string;
  file_id: number;
  [key: string]: unknown;
}

export default function PurchasedPage() {
  const { connected, address, requestRecords } = usePrivyWallet();
  const [records, setRecords] = useState<AccessRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!connected || !address || !requestRecords) {
      setLoading(false);
      return;
    }
    const programId = process.env.NEXT_PUBLIC_PRIVYSHARE_PROGRAM_ID ?? "privyshare_files_7879.aleo";
    requestRecords(programId)
      .then((raw) => {
        const list = Array.isArray(raw) ? raw : [];
        const access = list.filter(
          (r: unknown): r is AccessRecord =>
            typeof r === "object" &&
            r !== null &&
            "owner" in r &&
            "file_id" in r &&
            (r as AccessRecord).owner === address
        );
        setRecords(access);
      })
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [connected, address, requestRecords]);

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-privy-gray-400">Connect your wallet to see purchased files.</p>
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
        <h1 className="text-2xl font-semibold">Purchased Files</h1>
        <p className="mt-1 text-sm text-privy-gray-400">Files you have access to.</p>
        {loading && <p className="mt-6 text-privy-gray-400">Loading...</p>}
        {!loading && records.length === 0 && (
          <p className="mt-6 text-privy-gray-400">You have no access records yet.</p>
        )}
        {!loading && records.length > 0 && (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {records.map((r) => (
              <li key={`${r.file_id}-${r.owner}`}>
                <Link
                  href={`/files/${r.file_id}`}
                  className="card block transition hover:border-privy-gray-600"
                >
                  <span className="font-mono text-xs text-privy-gray-500">#{r.file_id}</span>
                  <p className="mt-1 font-medium">File {r.file_id}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
