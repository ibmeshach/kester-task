use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Raffle {
    pub cid: u64,
    pub creator: Pubkey,  // Creator of the raffle (usually the NFT owner)
    pub nft_mint: Pubkey, // NFT to be won
    pub entry_fee: u64,   // Amount in lamports to join
    pub max_entries: u8,  // Max number of participants
    #[max_len(255)]
    pub entries: Vec<Pubkey>, // List of user pubkeys who entered
    pub partial_winner: Pubkey, // The selected winner before claim
    pub winner: Pubkey,   // The actual winner after successful claim
    pub active: bool,
    pub locked: bool,     // Reentrancy protection flag
    pub expiry_date: i64, // Unix timestamp when the raffle expires
}
