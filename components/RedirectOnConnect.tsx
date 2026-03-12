"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePrivyWallet } from "@/lib/wallet/usePrivyWallet";

/**
 * When user connects wallet while on the home page, redirect to dashboard.
 */
export function RedirectOnConnect() {
  const pathname = usePathname();
  const router = useRouter();
  const { connected } = usePrivyWallet();

  useEffect(() => {
    if (pathname === "/" && connected) {
      router.replace("/dashboard");
    }
  }, [pathname, connected, router]);

  return null;
}
