use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};

use crate::{errors::ErrorCodes, state::*};

#[derive(Accounts)]
#[instruction()]
pub struct InitNutritionistApplicant<'info> {
    #[account(
        init,
        seeds = [NUTRITIONIST_APPLICANT_SEED, authority.key().as_ref()],
        bump,
        payer = authority,
        space = NutritionistApplicant::LEN
    )]
    pub nutritionist_applicant: Account<'info, NutritionistApplicant>,

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

    #[account(mut
        // seeds = [COMMUNITY_NETWORK_SEED],
        // bump
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

pub fn handler(ctx: Context<InitNutritionistApplicant>) -> Result<()> {
    let nutritionist_applicant = &mut ctx.accounts.nutritionist_applicant;
    let community_network = &mut ctx.accounts.community_network;

    nutritionist_applicant.authority = ctx.accounts.authority.key();
    nutritionist_applicant.nutritionist_token_account =
        ctx.accounts.nutritionist_token_account.key();
    nutritionist_applicant.nutritionist_nft_account = ctx.accounts.nutritionist_nft_account.key();
    nutritionist_applicant.id = *community_network.total_nutritionist_applications + 1;
    nutritionist_applicant.nutritionist_application_status =
        NutritionistApplicationStatus::Pending;
    nutritionist_applicant.is_whitelisted = false;
    nutritionist_applicant.bump = *ctx.bumps.get("nutritionist_applicant").unwrap();

    community_network.total_nutritionist_applications += 1;

    Ok(())
}
