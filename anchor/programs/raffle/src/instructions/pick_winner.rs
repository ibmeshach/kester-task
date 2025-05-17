use crate::errors::ErrorCode;
use crate::states::Raffle;
use anchor_lang::prelude::*;

#[event]
pub struct WinnerSelected {
    pub raffle: Pubkey,
    pub winner: Pubkey,
}

pub fn pick_winner(ctx: Context<PickWinnerCtx>, cid: u64) -> Result<()> {
    let raffle = &mut ctx.accounts.raffle;
    let creator: &Signer<'_> = &ctx.accounts.creator;

    // Validation
    if raffle.creator != creator.key() {
        return Err(ErrorCode::Unauthorized.into());
    }
    if !raffle.active {
        return Err(ErrorCode::RaffleNotActive.into());
    }
    if raffle.cid != cid {
        return Err(ErrorCode::RaffleNotFound.into());
    }
    if raffle.entries.is_empty() {
        return Err(ErrorCode::NotEnoughEntries.into());
    }

    let current_time = Clock::get()?.unix_timestamp;
    if current_time < raffle.expiry_date {
        return Err(ErrorCode::RaffleNotExpired.into());
    }

    // Select winner using pseudo-random logic
    let clock = Clock::get()?;
    let winner_index = (clock.slot as usize) % raffle.entries.len();
    let winner = raffle.entries[winner_index];

    // Store partial winner in raffle
    raffle.partial_winner = winner;

    emit!(WinnerSelected {
        raffle: raffle.key(),
        winner,
    });

    Ok(())
}

#[derive(Accounts)]
#[instruction(cid: u64)]
pub struct PickWinnerCtx<'info> {
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
