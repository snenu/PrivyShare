"use client";

import { QRCodeSVG } from "qrcode.react";

export function QRAddress({ address, size = 160 }: { address: string; size?: number }) {
  return (
    <div className="inline-flex rounded-lg border border-privy-gray-700 bg-privy-white p-3">
      <QRCodeSVG value={address} size={size} level="M" />
    </div>
  );
}
