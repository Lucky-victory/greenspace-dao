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

    // /// Nutritonist application status
    // pub nutritionist_application_status: NutritionistApplicationStatus,

    /// Reputation of nutritionist
    pub reputation: i64,

    /// nft account associated with nutritionist
    pub nutritionist_nft_account: Pubkey,

    // nutritionist status
    pub is_whitelisted: bool,

    /// Bump
    pub bump: u8,
}

// #[derive(Debug, AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Copy)]
// pub enum NutritionistApplicationStatus {
//     NotApplied,
//     Pending,
//     Accepted,
//     Rejected,
//     Canceled,
// }

impl Nutritionist {
    pub const LEN: usize = DISCRIMINATOR_LENGTH  // 8-byte discriminator
        + PUBKEY_LENGTH                          // Authority
        + PUBKEY_LENGTH                       // Nutritionist Token Account
        + DATA_LENGTH                            // id of Nutritionist on the platform
        // + NUTRITIONIST_ENUM_LENGTH              // Nutritionist application Status
        + DATA_LENGTH                            // Reputation
        + PUBKEY_LENGTH                       // Nutritionist Nft Account
        + BOOL_LENGTH                              //Whitelist status
        + BOOL_LENGTH; // PDA Bump
}
