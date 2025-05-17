import {
  AnchorProvider,
  BN,
  BorshCoder,
  EventParser,
  Program,
  Wallet,
  utils,
  web3,
} from "@coral-xyz/anchor";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
  ComputeBudgetProgram,
} from "@solana/web3.js";
import {
  dasApi,
  DasApiAsset,
  DasApiInterface,
} from "@metaplex-foundation/digital-asset-standard-api";

import {
  getClusterURL,
  getHeliusRpcUrl,
  getUmi,
  umiPublicKey,
} from "@/utils/helper";
import { Raffle } from "anchor/target/types/raffle";
import idl from "../../anchor/target/idl/raffle.json";
import { Raffle as RaffleType, ProgramState } from "@/utils/interfaces";
import { RpcInterface } from "@metaplex-foundation/umi";
import {
  createAssociatedTokenAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  TOKEN_2022_PROGRAM_ID,
} from "@solana/spl-token";

const CLUSTER: string = process.env.NEXT_PUBLIC_CLUSTER || "devnet";

const RPC_URL: string = getHeliusRpcUrl(CLUSTER);

export const getProvider = (
  publicKey: PublicKey | null,
  signTransaction: any,
  sendTransaction: any
): Program<Raffle> | null => {
  if (!publicKey || !signTransaction) {
    console.error("Wallet not connected or missing signTransaction");
    return null;
  }

  const connection = new Connection(RPC_URL, "confirmed");
  const provider = new AnchorProvider(
    connection,
    { publicKey, signTransaction, sendTransaction } as unknown as Wallet,
    { commitment: "processed" }
  );

  return new Program<Raffle>(idl as any, provider);
};

export const getProviderReadonly = (): Program<Raffle> => {
  const connection = new Connection(RPC_URL, "confirmed");

  const wallet = {
    publicKey: PublicKey.default,
    signTransaction: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
    signAllTransaction: async () => {
      throw new Error("Read-only provider cannot sign transactions.");
    },
  };

  const provider = new AnchorProvider(connection, wallet as unknown as Wallet, {
    commitment: "processed",
  });

  return new Program<Raffle>(idl as any, provider);
};

export const getNFTAsset = async (nftMint: string) => {
  const umi = getUmi() as unknown as {
    rpc: RpcInterface & DasApiInterface;
  };
  const mintPublicKey = umiPublicKey(nftMint);

  const asset = (await umi.rpc.getAsset(mintPublicKey)) as DasApiAsset;
  return asset;
};

export const initializeRaffle = async (
  program: Program<Raffle>,
  nftMint: string,
  entryFee: number,
  maxEntries: number,
  expiryDate: number
): Promise<string> => {
  if (!program.provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const creator = program.provider.publicKey;

  try {
    // Get the current CID
    const [programStatePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("program_state")],
      program.programId
    );

    const state = await program.account.programState.fetch(programStatePda);
    const CID = state.raffleCount.add(new BN(1));

    // Find the raffle PDA
    const [rafflePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("raffle"), CID.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    // Convert entry fee to lamports
    const entryFeeLamports = new BN(entryFee * LAMPORTS_PER_SOL);

    // Convert expiry date to Unix timestamp
    const expiryDateBN = new BN(expiryDate);

    // Initialize the raffle
    const txSignature = await program.methods
      .initializeRaffle(
        new PublicKey(nftMint),
        entryFeeLamports,
        maxEntries,
        expiryDateBN
      )
      .accountsPartial({
        systemProgram: SystemProgram.programId,
        programState: programStatePda,
      })
      .accounts({
        raffle: rafflePda,
        creator,
      })
      .rpc();

    return txSignature;
  } catch (error) {
    console.error("Error initializing raffle:", error);
    throw error;
  }
};

export const enterRaffle = async (
  program: Program<Raffle>,
  pda: string,
  amount: number
) => {
  if (!program.provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const creator = program.provider.publicKey;

  try {
    const raffle = await program.account.raffle.fetch(pda);
    const CID = raffle.cid;

    const [rafflePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("raffle"), CID.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    // Convert entry fee to lamports
    const entryFeeLamports = new BN(amount * LAMPORTS_PER_SOL);

    // Initialize the raffle
    const txSignature = await program.methods
      .enterRaffle(new BN(CID), entryFeeLamports)
      .accountsPartial({
        systemProgram: SystemProgram.programId,
        raffle: rafflePda,
      })
      .accounts({
        user: creator,
      })
      .rpc();

    return txSignature;
  } catch (error) {
    console.error("Error entering raffle:", error);
    throw error;
  }
};

export const closeRaffle = async (program: Program<Raffle>, pda: string) => {
  if (!program.provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const creator = program.provider.publicKey;

  try {
    const raffle = await program.account.raffle.fetch(pda);
    const CID = raffle.cid;
    // Get the current CID

    const [rafflePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("raffle"), CID.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    // Initialize the raffle
    const txSignature = await program.methods
      .closeRaffle(new BN(CID))
      .accountsPartial({
        systemProgram: SystemProgram.programId,
        raffle: rafflePda,
      })
      .accounts({
        creator,
      })
      .rpc();

    return txSignature;
  } catch (error) {
    console.error("Error closing raffle:", error);
    throw error;
  }
};

export const pickWinner = async (program: Program<Raffle>, pda: string) => {
  if (!program.provider.publicKey) {
    throw new Error("Wallet not connected");
  }

  const creator = program.provider.publicKey;
  const provider = program.provider as AnchorProvider;

  try {
    const raffle = await program.account.raffle.fetch(pda);
    const CID = raffle.cid;
    const nftMint = raffle.nftMint;

    const [rafflePda] = PublicKey.findProgramAddressSync(
      [Buffer.from("raffle"), CID.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    if (!raffle.entries || raffle.entries.length === 0) {
      throw new Error("No entries in raffle");
    }

    console.log(`Picking winner from ${raffle.entries.length} entries`);
    console.log("NFT Mint:", nftMint.toString());

    // First, determine which Token Program the NFT is using
    const mintAccountInfo = await provider.connection.getAccountInfo(nftMint);
    if (!mintAccountInfo) {
      throw new Error("Could not find NFT mint account");
    }

    // Check if the mint uses Token-2022 by examining owner of mint account
    const isToken2022 =
      mintAccountInfo.owner.toString() ===
      "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";
    console.log(`NFT uses Token-2022: ${isToken2022}`);

    // Use the appropriate Token program ID
    const TOKEN_PROGRAM = isToken2022
      ? new PublicKey("TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb")
      : TOKEN_PROGRAM_ID;

    // Get creator's token account using correct program ID
    const creatorTokenAccount = await getAssociatedTokenAddress(
      nftMint,
      creator,
      false,
      TOKEN_PROGRAM
    );

    // Check if creator token account exists
    const creatorAccountInfo = await provider.connection.getAccountInfo(
      creatorTokenAccount
    );
    if (!creatorAccountInfo) {
      throw new Error("Creator's token account doesn't exist");
    }

    // Call the program to pick winner
    const tx = await program.methods
      .pickWinner(CID)
      .accountsPartial({
        systemProgram: SystemProgram.programId,
        raffle: rafflePda,
      })
      .accounts({
        creator: creator,
      })
      .rpc({
        skipPreflight: false,
        commitment: "confirmed",
      });

    console.log("Pick winner transaction sent:", tx);

    // Wait for transaction confirmation and fetch the transaction details
    const txInfo = await provider.connection.getTransaction(tx, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (!txInfo || !txInfo.meta || !txInfo.meta.logMessages) {
      throw new Error("Failed to get transaction information");
    }

    console.log(
      "Processing transaction logs to extract WinnerSelected event..."
    );

    // Create an event parser for the program
    const eventParser = new EventParser(
      program.programId,
      new BorshCoder(program.idl)
    );

    // Parse the transaction logs to extract program events
    const events = eventParser.parseLogs(txInfo.meta.logMessages);

    console.log("Events:", events);

    // Find the WinnerSelected event
    const winnerSelectedEvent = events.find(
      (event: any) => event.name === "WinnerSelected"
    );

    if (!winnerSelectedEvent) {
      throw new Error("WinnerSelected event not found in transaction logs");
    }

    console.log("Found WinnerSelected event:", winnerSelectedEvent);

    // Extract the winner from the event
    const { winner } = winnerSelectedEvent.data;
    console.log("Winner Address:", winner.toString());

    // Get winner's token account
    const winnerTokenAccount = await getAssociatedTokenAddress(
      nftMint,
      winner,
      false,
      TOKEN_PROGRAM
    );

    // Check if winner's token account exists, if not create it
    const winnerAccountInfo = await provider.connection.getAccountInfo(
      winnerTokenAccount
    );

    if (!winnerAccountInfo) {
      console.log("Creating token account for winner");

      // Set higher compute units for the transaction
      const modifyComputeUnits = ComputeBudgetProgram.setComputeUnitLimit({
        units: 400000,
      });

      // Add priority fee to help ensure transaction success
      const addPriorityFee = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1_000_000,
      });

      // Create and send transaction with higher priority
      const transaction = new Transaction();
      transaction.add(modifyComputeUnits);
      transaction.add(addPriorityFee);

      // Create ATA instruction with appropriate program ID
      transaction.add(
        createAssociatedTokenAccountInstruction(
          creator, // payer
          winnerTokenAccount, // ata
          winner, // owner
          nftMint, // mint
          TOKEN_PROGRAM,
          isToken2022
            ? new PublicKey("ATokenzQd6gRNDgZcJsoysjW6DyyA3Xbq99A4HjZzFDN")
            : ASSOCIATED_TOKEN_PROGRAM_ID
        )
      );

      // Set recent blockhash and fee payer
      const latestBlockhash = await provider.connection.getLatestBlockhash(
        "confirmed"
      );
      transaction.recentBlockhash = latestBlockhash.blockhash;
      transaction.feePayer = creator;

      // Send the transaction
      const createAtaSignature = await provider.sendAndConfirm(transaction);
      console.log(
        `Created winner token account with signature: ${createAtaSignature}`
      );
    }

    // Call claim_nft to transfer the NFT to the winner
    const claimTx = await program.methods
      .claimNft(CID)
      .accountsPartial({
        raffle: rafflePda,
      })
      .accounts({
        creator: creator,
        winnerTokenAccount: winnerTokenAccount,
        creatorTokenAccount: creatorTokenAccount,
        tokenProgram: TOKEN_PROGRAM,
      })
      .rpc({
        skipPreflight: false,
        commitment: "confirmed",
      });

    console.log("Claim NFT transaction sent:", claimTx);

    return {
      pickWinnerTx: tx,
      claimNftTx: claimTx,
      winner: winner.toString(),
    };
  } catch (error) {
    console.error("Error in pick winner process:", error);
    throw error;
  }
};

export const fetchRaffles = async (
  program: Program<Raffle>,
  status: string
) => {
  const raffles = await program.account.raffle.all();
  const serializedRaffles = serializeRaffle(raffles);
  if (status === "active") {
    return serializedRaffles.filter((raffle) => raffle.active);
  } else if (status === "closed") {
    return serializedRaffles.filter((raffle) => !raffle.active);
  } else if (status === "") {
    return serializedRaffles;
  }
};

export const fetchRaffle = async (
  program: Program<Raffle>,
  pda: string
): Promise<RaffleType> => {
  const raffle = await program.account.raffle.fetch(pda);
  const serializedRaffle: RaffleType = {
    publicKey: pda,
    cid: raffle.cid.toNumber(),
    creator: raffle.creator.toBase58(),
    nftMint: raffle.nftMint.toBase58(),
    entryFee: raffle.entryFee.toNumber() / LAMPORTS_PER_SOL,
    maxEntries: raffle.maxEntries,
    entries: raffle.entries.map((entry) => entry.toBase58()),
    winner: raffle.winner.toBase58(),
    active: raffle.active,
    locked: raffle.locked,
    expiryDate: raffle.expiryDate.toNumber() * 1000,
  };
  return serializedRaffle;
};

const serializeRaffle = (raffle: any[]): RaffleType[] => {
  return raffle.map((r: any) => ({
    ...r.account,
    publicKey: r.publicKey.toBase58(),
    cid: r.account.cid.toNumber(),
    creator: r.account.creator.toBase58(),
    nftMint: r.account.nftMint.toBase58(),
    entryFee: r.account.entryFee.toNumber() / LAMPORTS_PER_SOL,
    maxEntries: r.account.maxEntries,
    expiryDate: r.account.expiryDate.toNumber() * 1000,
    entries: r.account.entries,
    winner: r.account.winner.toBase58(),
    active: r.account.active,
    locked: r.account.locked,
  }));
};

export const fetchRafflesByCreator = async (
  program: Program<Raffle>,
  creatorPublicKey: string
) => {
  const raffles = await program.account.raffle.all();
  const serializedRaffles = serializeRaffle(raffles);
  return serializedRaffles.filter(
    (raffle) => raffle.creator === creatorPublicKey
  );
};
