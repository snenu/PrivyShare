"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

interface ShareCardProps {
  fileId: number;
  title: string;
}

export function ShareCard({ fileId, title }: ShareCardProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/files/${fileId}`
      : `/files/${fileId}`;

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card">
      <h2 className="font-medium">Share this file</h2>
      <p className="mt-1 text-sm text-privy-gray-400">
        Anyone can scan the QR code or open the link to view the file and pay.
      </p>
      <div className="mt-4 flex flex-col sm:flex-row items-start gap-6">
        <div className="flex-shrink-0 rounded-lg border border-privy-gray-700 bg-white p-3">
          <QRCodeSVG value={shareUrl} size={140} level="M" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-privy-gray-500 mb-2">Share link</p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="input text-sm truncate bg-privy-gray-800"
            />
            <button
              type="button"
              onClick={copyLink}
              className="btn-secondary whitespace-nowrap text-sm py-2 px-3"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
          <p className="mt-3 text-xs text-privy-gray-500">
            Share the link or QR with buyers. They visit, connect wallet, pay, and you grant access.
          </p>
        </div>
      </div>
    </div>
  );
}
