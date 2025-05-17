use anchor_lang::prelude::*;
use crate::errors::ErrorCode;
use crate::states::Raffle;

pub fn enter_raffle(
    ctx: Context<EnterRaffleCtx>,
    cid: u64,
    amount: u64,
) -> Result<()> {
    let raffle = &mut ctx.accounts.raffle;
    let user = &ctx.accounts.user;
   
    // Reentrancy check
    if raffle.locked {
        return Err(ErrorCode::OperationLocked.into());
    }
    raffle.locked = true;

    // Basic validation
    if !raffle.active {
        raffle.locked = false;
        return Err(ErrorCode::RaffleNotActive.into());
    }
    if raffle.cid != cid {
        raffle.locked = false;
        return Err(ErrorCode::RaffleNotFound.into());
    }
    if amount < raffle.entry_fee {
        raffle.locked = false;
        return Err(ErrorCode::InvalidRaffleEntryFee.into());
    }
    if raffle.entries.len() >= raffle.max_entries as usize {
        raffle.locked = false;
        return Err(ErrorCode::MaxEntriesReached.into());
    }
    if raffle.entries.contains(&user.key()) {
        raffle.locked = false;
        return Err(ErrorCode::AlreadyEntered.into());
    }

    // Check if raffle has expired
    let current_time = Clock::get()?.unix_timestamp;
    if current_time >= raffle.expiry_date {
        raffle.locked = false;
        return Err(ErrorCode::RaffleExpired.into());
    }

    let tx_instruction = anchor_lang::solana_program::system_instruction::transfer(
        &user.key(),
        &raffle.key(),
        amount,
    );

    let result = anchor_lang::solana_program::program::invoke(
        &tx_instruction,
        &[user.to_account_info(), raffle.to_account_info()],
    );

    if let Err(e) = result {
        msg!("Error entering raffle: {:?}", e);
        raffle.locked = false; // Reset lock on error
        return Err(e.into());
    }
    
    raffle.entries.push(user.key());
    raffle.locked = false; // Reset lock after successful operation
   
    Ok(())
}

#[derive(Accounts)]
#[instruction(cid: u64)]
pub struct EnterRaffleCtx<'info> {
    #[account(
        mut, 
        seeds = [b"raffle", cid.to_le_bytes().as_ref()],
        bump
    )]
    pub raffle: Account<'info, Raffle>,

    #[account(mut)]
    pub user: Signer<'info>,

   
    pub system_program: Program<'info, System>,
}