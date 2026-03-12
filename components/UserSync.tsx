"use client";

import { useEffect, useRef } from "react";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";

export function UserSync() {
  const { address } = usePrivyWallet();
  const synced = useRef<string | null>(null);

  useEffect(() => {
    if (!address || synced.current === address) return;
    synced.current = address;
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    }).catch(() => {});
  }, [address]);

  return null;
}
