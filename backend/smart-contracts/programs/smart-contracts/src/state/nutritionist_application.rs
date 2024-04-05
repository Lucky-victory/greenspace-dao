use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct NutritonistApplication {
    
    /// Nutritionist applying for the role
    pub nutritonist: Pubkey,

    // /// Nutritionist Token Account
    // pub nutritionist_token_account: Pubkey,

    /// Nutritonist application status
    pub nutritonist_application_status: NutritonistApplicationStatus,

    /// Bump
    pub bump: u8,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Copy)]
pub enum NutritonistApplicationStatus {
    NotApplied,
    Pending,
    Accepted,
    Rejected,
    Canceled,
}

impl NutritonistApplication {
    pub const LEN: usize = DISCRIMINATOR_LENGTH // 8-byte discriminator
        + PUBKEY_LENGTH                         // Nutritionist
        // + PUBKEY_LENGTH                         // Nutritionist Token Account
        + ENUM_LENGTH                           // Nutritionist application Status
        + BOOL_LENGTH; // Bump
}
