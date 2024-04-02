use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct BountyApplication {
    /// Bounty being applied to
    pub bounty: Pubkey,

    /// Bounty creator this bounty belongs to
    pub bounty_creator: Pubkey,

    /// Bonuty hunter applying for this bounty
    pub bounty_hunter: Pubkey,

    /// User Token Account
    pub bounty_hunter_token_account: Pubkey,

    /// Bounty application status
    pub bounty_application_status: BountyStatus,

    /// Bump
    pub bump: u8,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Copy)]
pub enum NutritonistApplicationStatus {
    NoUpdate,
    Submitted,
    Accepted,
}

impl NutritonistApplicationStatus {
    pub const LEN: usize = DISCRIMINATOR_LENGTH // 8-byte discriminator
       // + PUBKEY_LENGTH                         // 
        + PUBKEY_LENGTH                         // Nutritionist
       // + PUBKEY_LENGTH                         //
        + PUBKEY_LENGTH                         // Nutritionist Token Account
        + ENUM_LENGTH                           // Nutritionist application Status
        + BOOL_LENGTH; // Bump
}