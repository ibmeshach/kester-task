use crate::errors::ErrorCode;
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Transfer};

pub fn claim_nft(ctx: Context<ClaimNftCtx>, cid: u64) -> Result<()> {
    // Validation
    if ctx.accounts.raffle.creator != ctx.accounts.creator.key() {
        return Err(ErrorCode::Unauthorized.into());
    }

    if ctx.accounts.raffle.cid != cid {
        return Err(ErrorCode::RaffleNotFound.into());
    }

    if ctx.accounts.raffle.active {
        return Err(ErrorCode::RaffleStillActive.into());
    }

    if ctx.accounts.raffle.partial_winner == Pubkey::default() {
        return Err(ErrorCode::NoWinnerSelected.into());
    }

    // Transfer NFT to winner
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
            from: ctx.accounts.creator_token_account.to_account_info(),
            to: ctx.accounts.winner_token_account.to_account_info(),
            authority: ctx.accounts.creator.to_account_info(),
        },
    );
    token::transfer(cpi_ctx, 1)?;

    // Transfer SOL to creator
    let rent = Rent::get()?;
    let min_rent = rent.minimum_balance(ctx.accounts.raffle.to_account_info().data_len());
    let lamports_available = ctx
        .accounts
        .raffle
        .to_account_info()
        .lamports()
        .saturating_sub(min_rent);

    if lamports_available > 0 {
        **ctx
            .accounts
            .raffle
            .to_account_info()
            .try_borrow_mut_lamports()? -= lamports_available;
        **ctx
            .accounts
            .creator
            .to_account_info()
            .try_borrow_mut_lamports()? += lamports_available;
    }

    // Update raffle state after successful transfers
    ctx.accounts.raffle.winner = ctx.accounts.raffle.partial_winner;
    ctx.accounts.raffle.active = false;

    Ok(())
}

#[derive(Accounts)]
#[instruction(cid: u64)]
pub struct ClaimNftCtx<'info> {
    #[account(
        mut,
        seeds = [b"raffle", cid.to_le_bytes().as_ref()],
        bump
    )]
    pub raffle: Account<'info, crate::states::Raffle>,

    #[account(mut)]
    pub creator: Signer<'info>,

    /// CHECK: winner's NFT token account
    #[account(mut)]
    pub winner_token_account: AccountInfo<'info>,

    /// CHECK: creator's NFT token account
    #[account(mut)]
    pub creator_token_account: AccountInfo<'info>,

    /// CHECK: token program (SPL or Token-2022)
    pub token_program: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
}
