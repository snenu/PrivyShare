"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";
import { encryptAndUpload } from "@/lib/upload";
import { cidToField } from "@/lib/aleo/encode";
import { getFileCounter } from "@/lib/aleo/programState";

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
    setError(null);
    setStep("encrypt");
    try {
      const { cid, ivBase64, saltBase64 } = await encryptAndUpload(file, password);
      const nextId = (await getFileCounter()) + 1;
      const fieldValue = cidToField(cid);
      setStep("tx");
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
      } else {
        setStep("error");
        setError("Transaction was not submitted.");
      }
    } catch (err) {
      setStep("error");
      setError(err instanceof Error ? err.message : "Upload failed");
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="text-privy-gray-400">Connect your wallet to upload files.</p>
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
              <label className="block text-sm font-medium text-privy-gray-300">File</label>
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
                Description (optional, stored locally)
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
      </main>
    </div>
  );
}
