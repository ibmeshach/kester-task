use anchor_lang::prelude::*;

use crate::constants::ANCHOR_DISCRIMINATOR_SIZE;
use crate::errors::ErrorCode;
use crate::states::ProgramState;

pub fn initialize(ctx: Context<InitializeCtx>) -> Result<()> {
    let state = &mut ctx.accounts.program_state;
    let deployer = &ctx.accounts.deployer;


    if state.initialized {
        return Err(ErrorCode::AlreadyInitialized.into());
    }


    state.raffle_count = 0;
    state.deployer = deployer.key();
    state.initialized = true;

    Ok(())
}


#[derive(Accounts)]
pub struct InitializeCtx<'info> {
    #[account(
        init, 
        payer = deployer, 
        space = ANCHOR_DISCRIMINATOR_SIZE + ProgramState::INIT_SPACE,
        seeds = [b"program_state"],
        bump
    )]

    pub program_state: Account<'info, ProgramState>,

    #[account(mut)]
    pub deployer: Signer<'info>,
    pub system_program: Program<'info, System>,
}