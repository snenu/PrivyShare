"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";
import { getRevokedAccess } from "@/lib/aleo/programState";
import { FileCardSkeleton } from "@/components/Skeleton";

interface AccessRecord {
  owner: string;
  file_id: number;
  [key: string]: unknown;
}

export default function PurchasedPage() {
  const { connected, address, requestRecords } = usePrivyWallet();
  const [records, setRecords] = useState<AccessRecord[]>([]);
  const [revokedMap, setRevokedMap] = useState<Record<number, boolean>>({});
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
        return access;
      })
      .then((access) => {
        if (access.length > 0) {
          return Promise.all(
            access.map((r) =>
              getRevokedAccess(r.file_id, address).then((revoked) => ({
                fileId: r.file_id,
                revoked,
              }))
            )
          ).then((results) => {
            const map: Record<number, boolean> = {};
            results.forEach(({ fileId, revoked }) => {
              map[fileId] = revoked;
            });
            setRevokedMap(map);
          });
        }
      })
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, [connected, address, requestRecords]);

  if (!connected) {
    return (
      <div className="text-center py-12">
        <p className="text-privy-gray-400">Connect your wallet to see purchased files.</p>
        <Link href="/" className="btn-primary mt-4 inline-block">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-semibold">Purchased Files</h1>
      <p className="mt-1 text-sm text-privy-gray-400">
        Files you have access to. Access status is verified on-chain.
      </p>
      {loading && (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <FileCardSkeleton key={i} />
          ))}
        </ul>
      )}
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
                {revokedMap[r.file_id] !== undefined && (
                  <span
                    className={`mt-2 inline-block rounded px-2 py-0.5 text-xs ${
                      revokedMap[r.file_id]
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }`}
                  >
                    {revokedMap[r.file_id] ? "Access revoked" : "Access active"}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
