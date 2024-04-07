use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct User {
    /// Authority of user
    pub authority: Pubkey,

    /// Reputation of user
    pub reputation: i64,

    /// User Token Account
    pub user_token_account: Pubkey,

    /// User Id on the platform
    pub id: u64,

    /// Community Network associated with the user
    pub community_network: Pubkey,

    /// nft account associated with user
    pub user_nft_account: Pubkey,

    /// subscription status
    pub user_subscription_status: UserStatus,

    
    /// Timestamp of applying
    pub timestamp: i64,

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
        + PUBKEY_LENGTH                          // user token account
        + DATA_LENGTH                            // id of User on the platform
        + PUBKEY_LENGTH                           // Community_network
        + USER_ENUM_LENGTH                          // User subscription Status
        + DATA_LENGTH                           // Timestamp of registration
        + BOOL_LENGTH; // PDA Bump
}
