use anchor_lang::prelude::*;

use crate::constants::*;

#[account]
pub struct Project {
    /// Name of the Community
    pub name: String,

    /// Display image link
    pub img_link: String,

    /// Community Description
    pub community_description: String,

    /// Authority of the Community
    pub authority: Pubkey,

    // /// Vault Token Account of the Community
    // pub community_vault: Pubkey,

    // /// Total Number of Members
    // pub total_members: u64,

    /// Community Id on the platform
    pub id: u64,

    /// Bump
    pub bump: u8,
}

impl Project {
    pub const LEN: usize = DISCRIMINATOR_LENGTH  // 8-byte discriminator
        + NAME_LENGTH                            // Name of the Project
        + LINK_LENGTH                      // Link of the Image
        + BIO_LENGTH                      // Link of the Image
        + PUBKEY_LENGTH                          // Community authority
        //+ PUBKEY_LENGTH                          // Community vault
        // + PUBKEY_LENGTH                          // Vault mint
        //+ DATA_LENGTH                            // Total members
        + DATA_LENGTH                            // Id of the community
        + BOOL_LENGTH; // Bump
}
