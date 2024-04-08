use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};

use crate::{errors::ErrorCodes, state::*};

#[derive(Accounts)]
#[instruction()]
pub struct InitUser<'info> {
    #[account(
        init,
        seeds = [USER_SEED, authority.key().as_ref()],
        bump,
        payer = authority,
        space = User::LEN
    )]
    pub user_account: Account<'info, User>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut,
        token::mint = USDC_MINT_PUBKEY
    )]
    pub user_token_account: Account<'info, TokenAccount>,

    #[account(mut,
        seeds = ["user-mint".as_bytes().as_ref()],
        bump
    )]
    pub user_nft_mint: Account<'info, Mint>,

    #[account(
        mut,
        init_if_needed,
        payer = authority,
        associated_token::mint = user_nft_mint,
        associated_token::authority = authority
    )]
    pub user_nft_account: Account<'info, TokenAccount>,

    #[account(
        seeds = [COMMUNITY_NETWORK_SEED],
        bump,
        has_one = community_network_vault_usdc_account
    )]
    pub community_network: Box<Account<'info, CommunityNetwork>>,

    #[account(
        mut,
        token::mint = USDC_MINT_PUBKEY
    )]
    pub community_network_vault_usdc_account: Account<'info, TokenAccount>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub clock: Sysvar<'info, Clock>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitUser>) -> Result<()> {
    let user = &mut ctx.accounts.user;
    let community_network = &mut ctx.accounts.community_network;

    user.authority = ctx.accounts.authority.key();
    user.reputation = 0;
    user.id = community_network.total_users + 1;
    user.user_subscription_status = UserStatus::Active;
    user.user_token_account = ctx.accounts.user_token_account.key();
    user.user_nft_account = ctx.accounts.user_nft_account.key();
    user.timestamp = ctx.accounts.clock.unix_timestamp;
    user.bump = *ctx.bumps.get("user_account").unwrap();

    //  // Convert USDC amount to lamports (assuming USDC has 6 decimals)
    //  let sub_amount = USER_SUB_AMOUNT * LAMPORTS_PER_USDC / 10u64.pow(6);

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.authority.to_account_info(),
                to: ctx
                    .accounts
                    .community_network_vault_usdc_account
                    .to_account_info(),
            },
        ),
        USER_SUB_AMOUNT,
    )?;

    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                authority: ctx.accounts.user_nft_mint.to_account_info(),
                to: ctx.accounts.user_nft_account.to_account_info(),
                mint: ctx.accounts.user_nft_mint.to_account_info(),
            },
            &[&[
                "user-mint".as_bytes(),
                &[*ctx.bumps.get("user_nft_mint").unwrap()],
            ]],
        ),
        1,
    )?;

    msg!("Minted user nft");

    Ok(())
}
