use anchor_lang::prelude::*;
use crate::errors::ErrorCode;
use crate::states::Raffle;

pub fn close_raffle(
    ctx: Context<CloseRaffleCtx>,
    cid: u64,
) -> Result<()> {
    let raffle = &mut ctx.accounts.raffle;
    let creator = &mut ctx.accounts.creator;
   
    require!(raffle.creator == creator.key(), ErrorCode::Unauthorized);
    require!(raffle.active, ErrorCode::RaffleNotActive);
    require!(raffle.cid == cid, ErrorCode::RaffleNotFound);
    require!(raffle.entries.is_empty(), ErrorCode::CannotCloseRaffleWithEntries);

    raffle.active = false;
 
   
    Ok(())
}


#[derive(Accounts)]
#[instruction(cid: u64)]
pub struct CloseRaffleCtx<'info> {
    #[account(
        mut, 
        seeds = [b"raffle", cid.to_le_bytes().as_ref()],
        bump
    )]
    pub raffle: Account<'info, Raffle>,

    #[account(mut)]
    pub creator: Signer<'info>,

    pub system_program: Program<'info, System>,
}