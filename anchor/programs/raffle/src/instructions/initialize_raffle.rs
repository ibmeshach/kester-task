use anchor_lang::prelude::*;

use crate::constants::ANCHOR_DISCRIMINATOR_SIZE;
use crate::errors::ErrorCode;
use crate::states::ProgramState;
use crate::states::Raffle;

pub fn initialize_raffle(
    ctx: Context<InitializeRaffleCtx>,
    nft_mint: Pubkey,
    entry_fee: u64,
    max_entries: u8,
    expiry_date: i64,
) -> Result<()> {
    let raffle = &mut ctx.accounts.raffle;
    let state = &mut ctx.accounts.program_state;

    // Validate entry fee
    if entry_fee <= 0 {
        return Err(ErrorCode::InvalidEntryFee.into());
    }
    // Validate max entries
    if max_entries <= 1 {
        return Err(ErrorCode::InvalidMaxEntries.into());
    }
    
    // Validate NFT mint
    if nft_mint == Pubkey::default() {
        return Err(ErrorCode::InvalidNftMint.into());
    }

    // Validate expiry date
    let current_time = Clock::get()?.unix_timestamp;
    if expiry_date <= current_time {
        return Err(ErrorCode::InvalidExpiryDate.into());
    }

    state.raffle_count += 1;
    raffle.cid = state.raffle_count;
    raffle.creator = ctx.accounts.creator.key();
    raffle.nft_mint = nft_mint;
    raffle.entry_fee = entry_fee;
    raffle.max_entries = max_entries;
    raffle.entries = Vec::new();
    raffle.winner = Pubkey::default();
    raffle.active = true;
    raffle.locked = false;
    raffle.expiry_date = expiry_date;
   
    Ok(())
}


#[derive(Accounts)]
pub struct InitializeRaffleCtx<'info> {
    #[account(
        mut,  
        seeds = [b"program_state"],
        bump
    )]
    pub program_state: Account<'info, ProgramState>,

    #[account(
        init, 
        payer = creator, 
        space = ANCHOR_DISCRIMINATOR_SIZE + Raffle::INIT_SPACE,
        seeds = [b"raffle", (program_state.raffle_count + 1).to_le_bytes().as_ref()],
        bump
    )]
    pub raffle: Account<'info, Raffle>,

   
    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
    


}