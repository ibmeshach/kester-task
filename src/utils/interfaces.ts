export interface Raffle {
  publicKey: string;
  cid: number;
  creator: string;
  nftMint: string;
  entryFee: number;
  maxEntries: number;
  entries: string[];
  winner: string;
  active: boolean;
  locked: boolean;
  expiryDate: number;
}

export interface ProgramState {
  initialized: boolean;
  raffleCount: number;
  deployer: string;
}
