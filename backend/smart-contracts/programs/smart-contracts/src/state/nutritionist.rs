use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct Nutritionist {
    /// Authority of Nutritionist
    pub authority: Pubkey,

    /// Nutritionist Token Account
    pub nutritionist_token_account: Pubkey,

    /// Nutritionist Id on the platform
    pub id: u64,

    /// Reputation of nutritionist
    pub reputation: i64,

    // nutritonist status
    pub is_whitelisted: bool;

    /// Bump
    pub bump: u8,
}

impl Nutritionist {
    pub const LEN: usize = DISCRIMINATOR_LENGTH  // 8-byte discriminator
        + PUBKEY_LENGTH                          // Authority
        + PUBKEY_LENGTH                       // Nutritionist Token Account
        + DATA_LENGTH                            // id of Nutritionist on the platform
        + DATA_LENGTH                            // Reputation
        + BOOL_LENGTH;                              //Whitelist status
        + BOOL_LENGTH; // PDA Bump
}
