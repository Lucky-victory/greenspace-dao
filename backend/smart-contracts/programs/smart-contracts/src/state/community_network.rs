use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct CommunityNetwork {
    /// Authority of GreenspaceDAO (will change to a multisig later)
    pub authority: Pubkey,

    /// Community Network Vault Token Account
    pub community_network_vault: Pubkey,

    /// Mint of the Community Network Vault Token
    pub vault_mint: Pubkey,

    /// Number of nutritionists whitelisted by the Greenspace
    pub whitelisted_nutritionists: u64,

    /// Number of registered users
    pub users: u64,

    /// Bump
    pub bump: u8,
}

impl Dao {
    pub const LEN: usize = DISCRIMINATOR_LENGTH      // 8-byte discriminator
        + PUBKEY_LENGTH                              // Authority of GreenspaceDAO
        + PUBKEY_LENGTH                              // Community Network Vault Token Account Greenspace
        + PUBKEY_LENGTH                              // Mint of Community Network Vault Token
        + DATA_LENGTH                                // Whitelisted Nutritionists
        + DATA_LENGTH                                // Whitelisted Users
        + BOOL_LENGTH; // Bump
}
