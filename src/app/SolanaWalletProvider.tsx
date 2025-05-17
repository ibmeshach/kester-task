"use client";

import { clusterApiUrl } from "@solana/web3.js";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  WalletConnectWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

const SolanaWalletProvider = ({ children }: { children: React.ReactNode }) => {
  const solanaConfig = useMemo(() => {
    const network = WalletAdapterNetwork.Mainnet;
    const testNetwork = WalletAdapterNetwork.Devnet;

    const adapters = [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new WalletConnectWalletAdapter({
        network,
        options: {
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
          metadata: {
            name: "Japaul Gold",
          },
        },
      }),
    ];

    const mainEndpoint = clusterApiUrl(network);
    const testEndpoint = clusterApiUrl(testNetwork);

    return {
      adapters,
      mainEndpoint,
      testEndpoint,
    };
  }, []);

  return (
    <ConnectionProvider endpoint={solanaConfig.mainEndpoint}>
      <WalletProvider wallets={solanaConfig.adapters} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default SolanaWalletProvider;
