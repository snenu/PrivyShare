"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";
import { getFileInfo } from "@/lib/aleo/programState";
import type { FileInfo } from "@/lib/aleo/programState";
import { fetchFromIpfs } from "@/lib/ipfs/client";
import { decryptFile } from "@/lib/crypto/encrypt";
import { decodeBase64ToUint8 } from "@/lib/upload";
import { isValidAleoAddress } from "@/lib/aleo/validate";
import { Skeleton } from "@/components/Skeleton";
import { ShareCard } from "@/components/ShareCard";

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
  const [downloadIv, setDownloadIv] = useState("");
  const [downloadSalt, setDownloadSalt] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const isOwner = connected && address && info?.owner === address;

  useEffect(() => {
    if (!id || isNaN(id)) {
      setLoading(false);
      setError("Invalid file id");
      return;
    }
    const local = loadLocalMeta(id);
    getFileInfo(id)
      .then(async (data) => {
        setInfo(data ?? null);
        const res = await fetch(`/api/files?fileId=${id}`);
        if (res.ok) {
          const dbMeta = await res.json();
          if (dbMeta?.cid) {
            setMeta(dbMeta);
            return;
          }
        }
        setMeta(local);
      })
      .catch((e) => {
        setError(e instanceof Error ? e.message : "Failed to load");
        setMeta(local);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    const cid = (meta?.cid ?? downloadCid).trim();
    const password = downloadPassword.trim();
    const ivB64 = meta?.ivBase64 ?? downloadIv.trim();
    const saltB64 = meta?.saltBase64 ?? downloadSalt.trim();
    if (!cid || !password) return;
    if (!ivB64 || !saltB64) {
      setDownloadError("IV and salt are required for decryption. Ask the seller to share them.");
      return;
    }
    setDownloading(true);
    setDownloadError(null);
    try {
      const ciphertext = await fetchFromIpfs(cid);
      const iv = decodeBase64ToUint8(ivB64);
      const salt = decodeBase64ToUint8(saltB64);
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
      setDownloadError(e instanceof Error ? e.message : "Decryption failed");
    } finally {
      setDownloading(false);
    }
  };

  const handleGrantAccess = async () => {
    const addr = buyerAddress.trim();
    if (!connected || !addr || !executeTransaction || !programId) return;
    if (!isValidAleoAddress(addr)) {
      setDownloadError("Invalid Aleo address. Must start with aleo1 and be 63 characters.");
      return;
    }
    if (!confirm(`Grant access to ${addr.slice(0, 16)}...?`)) return;
    setGranting(true);
    try {
      await executeTransaction({
        program: programId,
        function: "grant_access",
        inputs: [`${id}u64`, addr],
      });
      setBuyerAddress("");
    } catch (e) {
      console.error(e);
    } finally {
      setGranting(false);
    }
  };

  const handleRevokeAccess = async () => {
    const addr = revokeAddress.trim();
    if (!connected || !addr || !executeTransaction || !programId) return;
    if (!isValidAleoAddress(addr)) {
      setDownloadError("Invalid Aleo address.");
      return;
    }
    if (!confirm(`Revoke access for ${addr.slice(0, 16)}...?`)) return;
    setRevoking(true);
    try {
      await executeTransaction({
        program: programId,
        function: "revoke_access",
        inputs: [`${id}u64`, addr],
      });
      setRevokeAddress("");
    } catch (e) {
      console.error(e);
    } finally {
      setRevoking(false);
    }
  };

  const copyCid = () => {
    if (meta?.cid) {
      navigator.clipboard.writeText(meta.cid);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-6 h-24 w-full" />
        <Skeleton className="mt-4 h-12 w-48" />
      </div>
    );
  }

  if (error || !info) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-privy-gray-400">{error ?? "File not found"}</p>
        <Link href="/marketplace" className="btn-secondary mt-4 inline-block">
          Back to marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
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
        {isOwner && meta?.cid && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-privy-gray-500">CID:</span>
            <code className="flex-1 truncate text-xs text-privy-gray-400">{meta.cid}</code>
            <button type="button" onClick={copyCid} className="btn-secondary text-xs py-1 px-2">
              Copy CID
            </button>
          </div>
        )}
      </div>

      {isOwner && (
        <div className="mt-6">
          <ShareCard fileId={id} title={meta?.name ?? `File ${id}`} />
        </div>
      )}

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

      {!isOwner && !connected && (
        <div className="card mt-6">
          <h2 className="font-medium">Want to purchase?</h2>
          <p className="mt-2 text-sm text-privy-gray-400">
            Connect your Aleo wallet to pay the seller and get access. Your wallet is your login—no account needed.
          </p>
          <Link href="/" className="btn-primary mt-4 inline-block">
            Connect wallet
          </Link>
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
            <h2 className="font-medium">Download (after seller shared CID, password, IV &amp; salt)</h2>
            {downloadError && (
              <p className="mt-2 text-sm text-red-400">{downloadError}</p>
            )}
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
            <input
              type="text"
              className="input mt-2"
              placeholder="IV (base64)"
              value={downloadIv}
              onChange={(e) => setDownloadIv(e.target.value)}
            />
            <input
              type="text"
              className="input mt-2"
              placeholder="Salt (base64)"
              value={downloadSalt}
              onChange={(e) => setDownloadSalt(e.target.value)}
            />
            <button
              type="button"
              className="btn-primary mt-3"
              onClick={handleDownload}
              disabled={downloading || !downloadCid.trim() || !downloadPassword.trim() || !downloadIv.trim() || !downloadSalt.trim()}
            >
              {downloading ? "Decrypting..." : "Download"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
