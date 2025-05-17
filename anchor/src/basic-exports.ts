// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import RaffleIDL from "../target/idl/raffle.json";
import type { Raffle } from "../target/types/raffle";

// Re-export the generated IDL and type
export { Raffle, RaffleIDL };

// The programId is imported from the program IDL.
export const RAFFLE_PROGRAM_ID = new PublicKey(RaffleIDL.address);

// This is a helper function to get the Basic Anchor program.
export function getRaffleProgram(provider: AnchorProvider) {
  return new Program(RaffleIDL as Raffle, provider);
}
