import * as anchor from "@coral-xyz/anchor";
import { Raffle } from "../target/types/raffle";
import idl from "../target/idl/raffle.json";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  createInitializeAccountInstruction,
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
} from "@solana/spl-token";
import {
  Keypair,
  PublicKey as SolanaPublicKey,
  SystemProgram as SolanaSystemProgram,
} from "@solana/web3.js";

const { SystemProgram, PublicKey, LAMPORTS_PER_SOL } = anchor.web3;

describe("raffle", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);
  const program = new anchor.Program<Raffle>(idl as any, provider);
  const creator = provider.wallet;
  const participant = anchor.web3.Keypair.generate();
  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  let CID: any;
  let nftMint: SolanaPublicKey;
  let creatorTokenAccount: SolanaPublicKey;

  it("creates an NFT for testing", async () => {
    try {
      // Get the keypair from the provider
      const payer = (provider.wallet as any).payer as Keypair;

      // Create a new mints
      nftMint = await createMint(
        provider.connection,
        payer,
        creator.publicKey,
        creator.publicKey,
        0 // 0 decimals for NFT
      );
      console.log("Created NFT mint:", nftMint.toString());

      // Create token account for creator
      const tokenAccount = await getOrCreateAssociatedTokenAccount(
        provider.connection,
        payer,
        nftMint,
        creator.publicKey
      );
      creatorTokenAccount = tokenAccount.address;
      console.log("Creator token account:", creatorTokenAccount.toString());

      // Mint 1 NFT to creator
      await mintTo(
        provider.connection,
        payer,
        nftMint,
        creatorTokenAccount,
        creator.publicKey,
        1
      );
      console.log("Minted 1 NFT to creator");
    } catch (error) {
      console.error("Error creating NFT:", error);
      throw error;
    }
  });

  it("initiatize a raffle", async () => {
    try {
      const state = await program.account.programState.fetch(programStatePda);
      CID = state.raffleCount.add(new anchor.BN(1));

      const [rafflePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("raffle"), CID.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const entry_fee = new anchor.BN(2 * LAMPORTS_PER_SOL);
      const max_entries = 8;

      // Set expiry date to 24 hours from now
      const currentTime = Math.floor(Date.now() / 1000);
      const expiry_date = new anchor.BN(currentTime + 24 * 60 * 60); // 24 hours from now

      const tx = await program.methods
        .initializeRaffle(nftMint, entry_fee, max_entries, expiry_date)
        .accountsPartial({
          systemProgram: SystemProgram.programId,
          programState: programStatePda,
        })
        .accounts({
          raffle: rafflePda,
          creator: creator.publicKey,
        })
        .rpc();

      console.log("Transaction Signature:", tx);

      const raffle = await program.account.raffle.fetch(rafflePda);
      console.log("Raffle:", raffle);

      // Verify expiry date was set correctly
    } catch (error) {
      console.error("Error initializing raffle:", error);
      throw error;
    }
  });

  it("enters a raffle", async () => {
    try {
      const state = await program.account.programState.fetch(programStatePda);
      CID = state.raffleCount;

      const [rafflePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("raffle"), CID.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const amount = new anchor.BN(2 * LAMPORTS_PER_SOL);

      // Airdrop SOL to participant
      const airdropSignature = await provider.connection.requestAirdrop(
        participant.publicKey,
        10 * LAMPORTS_PER_SOL
      );
      await provider.connection.confirmTransaction(airdropSignature);

      const tx = await program.methods
        .enterRaffle(CID, amount)
        .accountsPartial({
          systemProgram: SystemProgram.programId,
          raffle: rafflePda,
        })
        .accounts({ user: participant.publicKey })
        .signers([participant])
        .rpc();

      console.log("Transaction Signature:", tx);

      const raffle = await program.account.raffle.fetch(rafflePda);
      console.log("Raffle:", raffle);
    } catch (error) {
      console.error("Error entering raffle:", error);
      throw error;
    }
  });

  it("closes a raffle", async () => {
    try {
      const state = await program.account.programState.fetch(programStatePda);
      CID = state.raffleCount;

      const [rafflePda] = PublicKey.findProgramAddressSync(
        [Buffer.from("raffle"), CID.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const tx = await program.methods
        .closeRaffle(CID)
        .accountsPartial({
          systemProgram: SystemProgram.programId,
          raffle: rafflePda,
        })
        .accounts({
          creator: creator.publicKey,
        })
        .rpc();

      console.log("Transaction Signature:", tx);

      const raffle = await program.account.raffle.fetch(rafflePda);
      console.log("Raffle:", raffle);
    } catch (error) {
      console.error("Error closing raffle:", error);
      throw error;
    }
  });
});
