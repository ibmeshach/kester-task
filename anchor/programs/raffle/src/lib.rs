#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod states;

use instructions::*;

// Program ID declaration (replace with your own ID when deploying...)
declare_id!("45fqb9u9AG2Jwjco4k8U8wdLUPjPjqCSY5iercuCBk8f");

#[program]
pub mod raffle {
    use super::*;

    pub fn initialize(ctx: Context<InitializeCtx>) -> Result<()> {
        instructions::initialize(ctx)
    }

    pub fn initialize_raffle(
        ctx: Context<InitializeRaffleCtx>,
        nft_mint: Pubkey,
        entry_fee: u64,
        max_entries: u8,
        expiry_date: i64,
    ) -> Result<()> {
        instructions::initialize_raffle(ctx, nft_mint, entry_fee, max_entries, expiry_date)
    }

    pub fn close_raffle(ctx: Context<CloseRaffleCtx>, cid: u64) -> Result<()> {
        instructions::close_raffle(ctx, cid)
    }

    pub fn enter_raffle(ctx: Context<EnterRaffleCtx>, cid: u64, amount: u64) -> Result<()> {
        instructions::enter_raffle(ctx, cid, amount)
    }

    pub fn pick_winner(ctx: Context<PickWinnerCtx>, cid: u64) -> Result<()> {
        instructions::pick_winner(ctx, cid)
    }

    pub fn claim_nft(ctx: Context<ClaimNftCtx>, cid: u64) -> Result<()> {
        instructions::claim_nft(ctx, cid)
    }
}
