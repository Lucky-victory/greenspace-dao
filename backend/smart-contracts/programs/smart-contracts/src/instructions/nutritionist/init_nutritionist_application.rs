use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};

use crate::{errors::ErrorCodes, state::*};

#[derive(Accounts)]
#[instruction()]
pub struct InitNutritionistApplication<'info> {
    #[account(
        init,
        seeds = [NUTRITIONIST_APPLICATION_SEED, authority.key().as_ref()],
        bump,
        payer = authority,
        space = NutritionistApplication::LEN
    )]
    pub nutritionist_application: Account<'info, NutritionistApplication>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        token::mint = USDC_MINT_PUBKEY
    )]
    pub nutritionist_token_account: Account<'info, TokenAccount>,

    #[account(mut,
        seeds = ["nutritionist-mint".as_bytes().as_ref()],
        bump
    )]
    pub nutritionist_nft_mint: Account<'info, Mint>,

    #[account(
        mut,
        init_if_needed,
        payer = authority,
        associated_token::mint = nutritionist_nft_mint,
        associated_token::authority = authority
    )]
    pub nutritionist_nft_account: Account<'info, TokenAccount>,

    #[account(
        seeds = [COMMUNITY_NETWORK_SEED],
        bump
        //has_one = community_network_vault_usdc_account
    )]
    pub community_network: Box<Account<'info, CommunityNetwork>>,

    // #[account(
    //     mut,
    //     token::mint = USDC_MINT_PUBKEY
    // )]
    // pub community_network_vault_usdc_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitNutritionist>) -> Result<()> {
    let nutritionist_application = &mut ctx.accounts.nutritionist_application;
    let community_network = &mut ctx.accounts.community_network;

    nutritionist_application.authority = ctx.accounts.authority.key();
    nutritionist_application.nutritionist_token_account = ctx.accounts.nutritionist_token_account.key();
    nutritionist_application.nutritionist_nft_account = ctx.accounts.nutritionist_nft_account.key();
    nutritionist_application.id = *community_network.total_nutritionist_applications + 1;
    nutritionist_application.nutritionist_application_status = NutritionistApplicationStatus::Pending;
    nutritionist_application.bump = *ctx.bumps.get("nutritionist_application").unwrap();

    community_network.total_nutritionist_applications += 1;
   
    Ok(())
}
