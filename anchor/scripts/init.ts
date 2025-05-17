import * as anchor from "@coral-xyz/anchor";
import idl from "../target/idl/raffle.json";
import { Raffle } from "../target/types/raffle";
import fs from "fs";
const { SystemProgram, PublicKey } = anchor.web3;

async function main(cluster: string) {
  // Define the cluster URLs
  const clusterUrls: any = {
    "mainnet-beta": "https://api.mainnet-beta.solana.com",
    testnet: "https://api.testnet.solana.com",
    devnet: "https://api.devnet.solana.com",
    localhost: "http://localhost:8899",
  };

  // Create a connection to the cluster
  const connection = new anchor.web3.Connection(
    clusterUrls[cluster],
    "confirmed"
  );

  // Load the wallet from the deployer's keypair file
  const keypairPath = `${process.env.HOME}/.config/solana/id.json`;
  const keypairData = JSON.parse(fs.readFileSync(keypairPath, "utf-8"));
  const wallet = anchor.web3.Keypair.fromSecretKey(
    Uint8Array.from(keypairData)
  );

  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    {
      commitment: "confirmed",
    }
  );

  anchor.setProvider(provider);

  // Load the program
  const program = new anchor.Program<Raffle>(idl as any, provider);

  const [programStatePda] = PublicKey.findProgramAddressSync(
    [Buffer.from("program_state")],
    program.programId
  );

  try {
    const state = await program.account.programState.fetch(programStatePda);
    console.log(`Program already initialized, status: ${state.initialized}`);
  } catch (error) {
    // Call the initialize instruction
    const tx = await program.methods
      .initialize()
      .accountsPartial({
        programState: programStatePda,
        systemProgram: SystemProgram.programId,
      })
      .accounts({
        deployer: provider.wallet.publicKey,
      })
      .rpc();

    const latestBlockhash = await connection.getLatestBlockhash();
    await connection.confirmTransaction(
      {
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        signature: tx,
      },
      "finalized"
    );
    console.log("Program initialized successfully.", tx);
  }
}

// Specify the cluster to target
const cluster =  "devnet";
main(cluster).catch((err) => {
  console.error("Error initializing program:", err);
});
