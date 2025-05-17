use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct ProgramState {
    pub initialized: bool,  // Useful if you only want one-time init
    pub raffle_count: u64,  // To track how many raffles have been created
    pub deployer: Pubkey,    // Who initialized the factory (admin or app owner)
}


