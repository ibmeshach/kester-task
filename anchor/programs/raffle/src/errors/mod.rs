use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    #[msg("This program has already been initialized.")]
    AlreadyInitialized,
    #[msg("Entry fee must be greater than 0")]
    InvalidEntryFee,
    #[msg("Maximum entries must be greater than 1 and less than 255")]
    InvalidMaxEntries,
    #[msg("Invalid NFT mint address")]
    InvalidNftMint,
    #[msg("Unauthorized access")]
    Unauthorized,
    #[msg("Raffle is not active")]
    RaffleNotActive,
    #[msg("Raffle is not found")]
    RaffleNotFound,
    #[msg("Amount is less than raffle entry fee")]
    InvalidRaffleEntryFee,
    #[msg("Maximum number of entries reached")]
    MaxEntriesReached,
    #[msg("User has already entered this raffle")]
    AlreadyEntered,
    #[msg("Not enough entries found, must be at least 1")]
    NotEnoughEntries,
    #[msg("Cannot close raffle when there are entries")]
    CannotCloseRaffleWithEntries,
    #[msg("Operation is locked")]
    OperationLocked,
    #[msg("NFT not transferred to raffle account")]
    NftNotTransferred,
    #[msg("Invalid NFT supply")]
    InvalidNftSupply,
    #[msg("Missing token accounts")]
    MissingTokenAccounts,
    #[msg("Raffle has expired")]
    RaffleExpired,
    #[msg("Invalid expiry date - must be in the future")]
    InvalidExpiryDate,
    #[msg("Raffle has not expired yet")]
    RaffleNotExpired,
    #[msg("Invalid token program")]
    InvalidTokenProgram,
    #[msg("Raffle is still active")]
    RaffleStillActive,
    #[msg("Winner is not the winner of the raffle")]
    WinnerNotTheWinner,
    #[msg("No winner has been selected for this raffle")]
    NoWinnerSelected,
}
