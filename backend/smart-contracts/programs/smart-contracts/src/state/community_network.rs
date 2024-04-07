use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct CommunityNetwork {
    /// Authority of GreenspaceDAO (will change to a multisig later)
    pub admin: Pubkey,

    /// Community Network Vault Token Account
    pub community_network_usdc_vault: Pubkey,

    /// Mint of the user nft
    pub user_nft_mint: Pubkey,

    /// Mint of the user nft
    pub nutritionist_nft_mint: Pubkey,

    /// Total Number of nutritionists applications
    pub total_nutritionist_applications: u64,

    /// Number of nutritionists whitelisted by the Greenspace
    pub total_whitelisted_nutritionists: u64,

    /// Number of registered users
    pub total_users: u64,

    /// Bump
    pub bump: u8,
}

impl Dao {
    pub const LEN: usize = DISCRIMINATOR_LENGTH      // 8-byte discriminator
        + PUBKEY_LENGTH                              // Authority of GreenspaceDAO
        + PUBKEY_LENGTH                              // Community Network Vault Token Account Greenspace
        + PUBKEY_LENGTH                              // Mint of User NFT
        + PUBKEY_LENGTH                              //Mint of the Nutritionist NFT
        + DATA_LENGTH                                // Total number of Nutritionist applications
        + DATA_LENGTH                                // Whitelisted Nutritionists
        + DATA_LENGTH                                // Whitelisted Users
        + BOOL_LENGTH; // Bump
}
