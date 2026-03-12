"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";
import { getFileInfo } from "@/lib/aleo/programState";
import type { FileInfo } from "@/lib/aleo/programState";
import { fetchFromIpfs } from "@/lib/ipfs/client";
import { decryptFile } from "@/lib/crypto/encrypt";
import { decodeBase64ToUint8 } from "@/lib/upload";

interface FileMeta {
  name?: string;
  description?: string;
  cid?: string;
  ivBase64?: string;
  saltBase64?: string;
}

function loadLocalMeta(fileId: number): FileMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`privyshare_meta_${fileId}`);
    if (!raw) return null;
    return JSON.parse(raw) as FileMeta;
  } catch {
    return null;
  }
}

export default function FileDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const { connected, address, executeTransaction, programId } = usePrivyWallet();
  const [info, setInfo] = useState<FileInfo | null>(null);
  const [meta, setMeta] = useState<FileMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [granting, setGranting] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [buyerAddress, setBuyerAddress] = useState("");
  const [revokeAddress, setRevokeAddress] = useState("");
  const [downloadCid, setDownloadCid] = useState("");
  const [downloadPassword, setDownloadPassword] = useState("");
  const [downloading, setDownloading] = useState(false);

  const isOwner = connected && address && info?.owner === address;

  useEffect(() => {
    if (!id || isNaN(id)) {
      setLoading(false);
      setError("Invalid file id");
      return;
    }
    getFileInfo(id)
      .then((data) => {
        setInfo(data ?? null);
        setMeta(loadLocalMeta(id));
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    const cid = (meta?.cid ?? downloadCid).trim();
    const password = downloadPassword.trim();
    if (!cid || !password) return;
    setDownloading(true);
    try {
      const ciphertext = await fetchFromIpfs(cid);
      const iv = meta?.ivBase64 ? decodeBase64ToUint8(meta.ivBase64) : new Uint8Array(12);
      const salt = meta?.saltBase64 ? decodeBase64ToUint8(meta.saltBase64) : new Uint8Array(16);
      const decrypted = await decryptFile(
        new Uint8Array(ciphertext),
        iv,
        salt,
        password
      );
      const blob = new Blob([decrypted]);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = meta?.name ?? `file-${id}`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error(e);
    } finally {
      setDownloading(false);
    }
  };

  const handleGrantAccess = async () => {
    if (!connected || !buyerAddress.trim() || !executeTransaction || !programId) return;
    setGranting(true);
    try {
      await executeTransaction({
        program: programId,
        function: "grant_access",
        inputs: [`${id}u64`, buyerAddress.trim()],
      });
      setBuyerAddress("");
    } catch (e) {
      console.error(e);
    } finally {
      setGranting(false);
    }
  };

  const handleRevokeAccess = async () => {
    if (!connected || !revokeAddress.trim() || !executeTransaction || !programId) return;
    setRevoking(true);
    try {
      await executeTransaction({
        program: programId,
        function: "revoke_access",
        inputs: [`${id}u64`, revokeAddress.trim()],
      });
      setRevokeAddress("");
    } catch (e) {
      console.error(e);
    } finally {
      setRevoking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-privy-gray-400">Loading...</p>
        </main>
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-2xl px-4 py-8">
          <p className="text-privy-gray-400">{error ?? "File not found"}</p>
          <Link href="/marketplace" className="btn-secondary mt-4 inline-block">
            Back to marketplace
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-8">
        <Link href="/marketplace" className="text-sm text-privy-gray-400 hover:text-privy-white">
          ← Marketplace
        </Link>
        <div className="card mt-6">
          <span className="font-mono text-xs text-privy-gray-500">#{id}</span>
          <h1 className="mt-2 text-xl font-semibold">{meta?.name ?? `File ${id}`}</h1>
          {meta?.description && (
            <p className="mt-2 text-sm text-privy-gray-400">{meta.description}</p>
          )}
          <p className="mt-2 text-sm">Price: {info.price} credits</p>
          <p className="mt-1 text-xs text-privy-gray-500">Owner: {info.owner.slice(0, 12)}...</p>
        </div>

        {isOwner && (
          <div className="card mt-6">
            <h2 className="font-medium">Grant access (after payment)</h2>
            <p className="mt-1 text-sm text-privy-gray-400">
              Enter buyer address to grant access.
            </p>
            <input
              type="text"
              className="input mt-3"
              placeholder="aleo1..."
              value={buyerAddress}
              onChange={(e) => setBuyerAddress(e.target.value)}
            />
            <button
              type="button"
              className="btn-primary mt-3"
              onClick={handleGrantAccess}
              disabled={granting || !buyerAddress.trim()}
            >
              {granting ? "Granting..." : "Grant access"}
            </button>
            <h3 className="mt-6 font-medium">Revoke access</h3>
            <input
              type="text"
              className="input mt-2"
              placeholder="Address to revoke"
              value={revokeAddress}
              onChange={(e) => setRevokeAddress(e.target.value)}
            />
            <button
              type="button"
              className="btn-secondary mt-2"
              onClick={handleRevokeAccess}
              disabled={revoking || !revokeAddress.trim()}
            >
              {revoking ? "Revoking..." : "Revoke access"}
            </button>
          </div>
        )}

        {isOwner && meta?.cid && (
          <div className="card mt-6">
            <h2 className="font-medium">Download</h2>
            <p className="mt-1 text-sm text-privy-gray-400">Enter your encryption password.</p>
            <input
              type="password"
              className="input mt-3"
              placeholder="Password"
              value={downloadPassword}
              onChange={(e) => setDownloadPassword(e.target.value)}
            />
            <button
              type="button"
              className="btn-primary mt-3"
              onClick={handleDownload}
              disabled={downloading || !downloadPassword.trim()}
            >
              {downloading ? "Decrypting..." : "Download"}
            </button>
          </div>
        )}

        {!isOwner && connected && (
          <>
            <div className="card mt-6">
              <h2 className="font-medium">Your address for payment</h2>
              <p className="mt-2 text-sm text-privy-gray-400">
                Share this with the seller so they can grant access after payment.
              </p>
              <p className="mt-2 font-mono text-xs break-all bg-privy-gray-800 p-3 rounded">{address}</p>
              <button
                type="button"
                onClick={() => address && navigator.clipboard.writeText(address)}
                className="btn-secondary mt-2 text-sm"
              >
                Copy address
              </button>
            </div>
            <p className="mt-6 text-sm text-privy-gray-400">
              Pay the seller, then ask them to grant access for your address.
            </p>
            <div className="card mt-6">
              <h2 className="font-medium">Download (after seller shared link &amp; password)</h2>
              <input
                type="text"
                className="input mt-3"
                placeholder="IPFS CID"
                value={downloadCid}
                onChange={(e) => setDownloadCid(e.target.value)}
              />
              <input
                type="password"
                className="input mt-2"
                placeholder="Decryption password"
                value={downloadPassword}
                onChange={(e) => setDownloadPassword(e.target.value)}
              />
              <button
                type="button"
                className="btn-primary mt-3"
                onClick={handleDownload}
                disabled={downloading || !downloadCid.trim() || !downloadPassword.trim()}
              >
                {downloading ? "Decrypting..." : "Download"}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
