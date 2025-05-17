import { Raffle, ProgramState } from "@/utils/interfaces";

export const raffles: Raffle[] = [
  {
    publicKey: "0x1234567890abcdef",
    cid: 1,
    creator: "0x1234567890abcdef",
    nftMint: "0xabcdef1234567890",
    entryFee: 1000000, // 0.001 SOL
    maxEntries: 100,
    entries: ["0x1111111111111111", "0x2222222222222222", "0x3333333333333333"],
    winner: "",
    active: true,
    locked: false,
    expiryDate: Date.now() + 86400000 * 7, // 7 days from now
  },
  {
    publicKey: "0x9876543210fedcba",
    cid: 2,
    creator: "0x9876543210fedcba",
    nftMint: "0xfedcba0987654321",
    entryFee: 2000000, // 0.002 SOL
    maxEntries: 50,
    entries: ["0x4444444444444444", "0x5555555555555555"],
    winner: "",
    active: true,
    locked: false,
    expiryDate: Date.now() + 86400000 * 3, // 3 days from now
  },
  {
    publicKey: "0x5555555555555555",
    cid: 3,
    creator: "0x5555555555555555",
    nftMint: "0x5555555555555555",
    entryFee: 5000000, // 0.005 SOL
    maxEntries: 200,
    entries: [
      "0x6666666666666666",
      "0x7777777777777777",
      "0x8888888888888888",
      "0x9999999999999999",
    ],
    winner: "0x7777777777777777",
    active: false,
    locked: true,
    expiryDate: Date.now() - 86400000, // expired yesterday
  },
];

export const dummyProgramState: ProgramState = {
  initialized: true,
  raffleCount: 3,
  deployer: "0x1234567890abcdef",
};
