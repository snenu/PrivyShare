"use client";

import { useWallet } from "@provablehq/aleo-wallet-adaptor-react";
import { Network } from "@provablehq/aleo-types";
import { PRIVYSHARE_PROGRAM_ID } from "@/lib/aleo/config";

const TARGET_NETWORK = Network.TESTNET;

export function usePrivyWallet() {
  const wallet = useWallet();

  const isTestnet = wallet.network === TARGET_NETWORK;
  const needsNetworkSwitch = wallet.connected && !isTestnet;

  const ensureNetwork = async () => {
    if (!wallet.connected || isTestnet) return true;
    const ok = await wallet.switchNetwork?.(TARGET_NETWORK);
    return !!ok;
  };

  return {
    ...wallet,
    programId: PRIVYSHARE_PROGRAM_ID,
    isTestnet,
    needsNetworkSwitch,
    ensureNetwork,
  };
}
