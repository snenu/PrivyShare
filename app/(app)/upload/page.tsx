"use client";

import { useState } from "react";
import Link from "next/link";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";
import { encryptAndUpload } from "@/lib/upload";
import { cidToField } from "@/lib/aleo/encode";
import { getFileCounter } from "@/lib/aleo/programState";

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const REGISTER_RETRIES = 3;

export default function UploadPage() {
  const { connected, address, executeTransaction, programId } = usePrivyWallet();
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [step, setStep] = useState<"idle" | "encrypt" | "tx" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connected || !file || !password.trim() || !price.trim() || !executeTransaction) {
      setError("Connect wallet and fill file, password, and price.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }
    setError(null);
    setStep("encrypt");
    try {
      const { cid, ivBase64, saltBase64 } = await encryptAndUpload(file, password);
      const fieldValue = await cidToField(cid);
      setStep("tx");
      let lastError: Error | null = null;
      for (let attempt = 0; attempt < REGISTER_RETRIES; attempt++) {
        try {
          const nextId = (await getFileCounter()) + 1;
          const result = await executeTransaction({
            program: programId,
            function: "register_file",
            inputs: [`${fieldValue}field`, `${price.trim()}u64`, `${nextId}u64`],
          });
          if (result?.transactionId) {
            setTxId(result.transactionId);
            setStep("done");
            const meta = {
              fileId: nextId,
              cid,
              name: file.name,
              description,
              price: price.trim(),
              ivBase64,
              saltBase64,
            };
            const key = `privyshare_meta_${nextId}`;
            try {
              localStorage.setItem(key, JSON.stringify(meta));
            } catch (_) {}
            if (address) {
              const postMeta = () =>
                fetch("/api/files", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    fileId: nextId,
                    ownerAddress: address,
                    cid,
                    name: file.name,
                    description,
                    ivBase64,
                    saltBase64,
                  }),
                });
              postMeta().then(async (res) => {
                if (!res.ok && res.status === 403) {
                  await new Promise((r) => setTimeout(r, 2000));
                  postMeta();
                }
              }).catch(() => {});
            }
            return;
          }
        } catch (err) {
          lastError = err instanceof Error ? err : new Error(String(err));
          if (attempt < REGISTER_RETRIES - 1) await new Promise((r) => setTimeout(r, 1500));
        }
      }
      setStep("error");
      setError(lastError?.message ?? "Transaction failed after retries.");
    } catch (err) {
      setStep("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  if (!connected) {
    return (
      <div className="text-center py-12">
        <p className="text-privy-gray-400">Connect your wallet to upload files.</p>
        <Link href="/" className="btn-primary mt-4 inline-block">
          Go home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold">Upload File</h1>
      <p className="mt-1 text-sm text-privy-gray-400">
        File is encrypted on your device, then stored on IPFS and registered on Aleo.
      </p>

      {step === "done" && txId && (
        <div className="mt-6 rounded-lg border border-privy-gray-700 bg-privy-gray-900/50 p-4">
          <p className="font-medium text-privy-white">Listed on-chain</p>
          <p className="mt-1 text-sm text-privy-gray-400">Tx: {txId.slice(0, 16)}...</p>
          <Link href="/my-files" className="btn-primary mt-4 inline-block">
            View My Files
          </Link>
        </div>
      )}

      {step !== "done" && (
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-privy-gray-300">File (max {MAX_FILE_SIZE_MB}MB)</label>
            <input
              type="file"
              className="input mt-1"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-privy-gray-300">
              Encryption password
            </label>
            <input
              type="password"
              className="input mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Used to encrypt; give to buyer after purchase"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-privy-gray-300">
              Price (microcredits)
            </label>
            <p className="mt-0.5 text-xs text-privy-gray-500">
              1 credit = 1,000,000 microcredits. e.g. 1000000 = 1 credit
            </p>
            <input
              type="text"
              className="input mt-1"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 1000000"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-privy-gray-300">
              Description (optional, stored in DB)
            </label>
            <input
              type="text"
              className="input mt-1"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
            />
          </div>
          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}
          <button
            type="submit"
            className="btn-primary w-full"
            disabled={step === "encrypt" || step === "tx"}
          >
            {step === "encrypt" && "Encrypting & uploading..."}
            {step === "tx" && "Registering on-chain..."}
            {(step === "idle" || step === "error") && "Upload & register"}
          </button>
        </form>
      )}
    </div>
  );
}
