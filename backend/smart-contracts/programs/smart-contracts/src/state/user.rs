use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct User {

    /// Authority of user
    pub authority: Pubkey,

    /// Reputation of user
    pub reputation: i64,

    ///might not use cause of associated token account
    // /// User Token Account
    // pub user_token_account: Pubkey,

    /// User Id on the platform
    pub id: u64,

    /// Community Network associated with the user
    pub community_network: Pubkey;

    /// subscription status
    pub user_subscription_status: UserStatus,

    /// Bump
    pub bump: u8,
}

#[derive(Debug, AnchorSerialize, AnchorDeserialize, Eq, PartialEq, Clone, Copy)]
pub enum UserStatus {
    NotActive,
    Active,
    Expired,
}

impl User {
    pub const LEN: usize = DISCRIMINATOR_LENGTH  // 8-byte discriminator          
        + PUBKEY_LENGTH                          // Authority
        + DATA_LENGTH                            // Reputation
        + DATA_LENGTH                            // id of User on the platform
        + PUBKEY_LENGTH                           // Community_network
        + USER_ENUM_LENGTH                          // User subscription Status
        + BOOL_LENGTH; // PDA Bump
}