"use client";

import { AleoWalletProvider } from "@provablehq/aleo-wallet-adaptor-react";
import { WalletModalProvider } from "@provablehq/aleo-wallet-adaptor-react-ui";
import { LeoWalletAdapter } from "@provablehq/aleo-wallet-adaptor-leo";
import { PuzzleWalletAdapter } from "@provablehq/aleo-wallet-adaptor-puzzle";
import { FoxWalletAdapter } from "@provablehq/aleo-wallet-adaptor-fox";
import { ShieldWalletAdapter } from "@provablehq/aleo-wallet-adaptor-shield";
import { Network } from "@provablehq/aleo-types";
import "@provablehq/aleo-wallet-adaptor-react-ui/dist/styles.css";
import { PRIVYSHARE_PROGRAM_ID } from "@/lib/aleo/config";

const wallets = [
  new LeoWalletAdapter(),
  new PuzzleWalletAdapter(),
  new FoxWalletAdapter(),
  new ShieldWalletAdapter(),
];

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AleoWalletProvider
      wallets={wallets}
      network={Network.TESTNET}
      autoConnect
      programs={[PRIVYSHARE_PROGRAM_ID]}
    >
      <WalletModalProvider>{children}</WalletModalProvider>
    </AleoWalletProvider>
  );
}
