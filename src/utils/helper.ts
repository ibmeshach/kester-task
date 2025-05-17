import { publicKey, Umi, UmiPlugin } from "@metaplex-foundation/umi";

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api";
import { Connection, PublicKey } from "@solana/web3.js";

export function truncateAddress(address: string): string {
  if (!address) {
    throw new Error("Invalid address");
  }

  const truncated = `${address.slice(0, 4)}...${address.slice(-4)}`;
  return truncated;
}

export const getClusterURL = (cluster: string): string => {
  const clusterUrls: any = {
    "mainnet-beta": "https://api.mainnet-beta.solana.com",
    testnet: "https://api.testnet.solana.com",
    devnet: "https://api.devnet.solana.com",
    localhost: "http://127.0.0.1:8899",
  };

  return clusterUrls[cluster];
};

export const getHeliusRpcUrl = (cluster: string): string => {
  const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY;

  if (!HELIUS_API_KEY) {
    console.warn("No Helius API key provided, falling back to default RPC");
    return getClusterURL(cluster as any);
  }

  switch (cluster.toLowerCase()) {
    case "mainnet":
    case "mainnet-beta":
      return `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    case "devnet":
      return `https://devnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`;
    default:
      return getClusterURL(cluster as any); // Fallback to original function for unsupported networks
  }
};

export const umiPublicKey = (address: string) => {
  return publicKey(address);
};

export const getUmi = () => {
  const CLUSTER: string = "devnet";
  const RPC_URL: string = getHeliusRpcUrl(CLUSTER);
  const connection = new Connection(RPC_URL);
  return createUmi(connection.rpcEndpoint).use(dasApi());
};

export function isValidSolanaAddress(address: string): boolean {
  try {
    const key = new PublicKey(address);
    return (
      key.toBase58() === address && // Make sure no weird base58 transformations happened
      address !== "11111111111111111111111111111111" // Exclude system address
    );
  } catch {
    return false;
  }
}
