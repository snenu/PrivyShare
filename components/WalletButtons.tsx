"use client";

import Link from "next/link";
import { WalletMultiButton } from "@provablehq/aleo-wallet-adaptor-react-ui";

export function WalletButtons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <WalletMultiButton />
      <Link href="/marketplace" className="btn-secondary">
        Browse marketplace
      </Link>
      <Link href="/upload" className="btn-secondary">
        Upload file
      </Link>
    </div>
  );
}
