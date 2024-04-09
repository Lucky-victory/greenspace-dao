use crate::accounts;
use crate::{errors::ErrorCodes, state::*};
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_instruction::create_account_with_seed;
use anchor_lang::system_program::CreateAccountWithSeed;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};
use solana_program::program::invoke_signed;

use crate::constants::{
    ADMIN, COMMUNITY_NETWORK_SEED, NUTRITIONIST_APPLICANT_SEED, NUTRITIONIST_SEED, USDC_MINT_PUBKEY,
};

#[derive(Accounts)]
// #[instruction(_nutritionist_applicant: Pubkey)]
#[instruction()]
pub struct ApproveNutritionistApplication<'info> {
    #[account(
        mut,
        //seeds = [NUTRITIONIST_APPLICANT_SEED, _nutritionist_applicant.key().as_ref()],
        seeds = [NUTRITIONIST_APPLICANT_SEED, nutritionist_applicant_authority.key().as_ref()],
        bump = nutritionist_applicant.bump
        //constraint = nutritionist_applicant.key() == _nutritionist_applicant.key()
        // constraint = nutritionist_applicant.key() == Pubkey::create_program_address(&[NUTRITIONIST_APPLICANT_SEED, nutritionist_applicant_authority.key().as_ref()], program_id).unwrap()
    )]
    pub nutritionist_applicant: Account<'info, NutritionistApplicant>,

    /// CHECK: This is not dangerous
    pub nutritionist_applicant_authority: AccountInfo<'info>,

    #[account(mut, address = ADMIN)]
    pub authority: Signer<'info>,

    // #[account(
    //     mut,
    //     token::mint = USDC_MINT_PUBKEY
    // )]
    // pub nutritionist_token_account: Account<'info, TokenAccount>,
    #[account(mut,
        seeds = ["nutritionist-mint".as_bytes().as_ref()],
        bump
    )]
    pub nutritionist_nft_mint: Account<'info, Mint>,

    #[account(
        init_if_needed,
        payer = authority,
        associated_token::mint = nutritionist_nft_mint,
        associated_token::authority = nutritionist_applicant_authority
    )]
    pub nutritionist_nft_account: Account<'info, TokenAccount>,
    
    #[account(mut,
        seeds = [COMMUNITY_NETWORK_SEED],
        bump
        //has_one = community_network_vault_usdc_account
    )]
    pub community_network: Box<Account<'info, CommunityNetwork>>,

    pub token_program: Program<'info, Token>,

    pub associated_token_program: Program<'info, AssociatedToken>,

    pub system_program: Program<'info, System>,

    #[account(
        init,
        seeds = [NUTRITIONIST_SEED, nutritionist_applicant_authority.key().as_ref()],
        bump,
        payer = authority,
        space = Nutritionist::LEN
    )]
    pub new_nutritionist_account: Account<'info, Nutritionist>,


    //pub new_nutritionist_account: AccountInfo<'info>,

    pub rent: Sysvar<'info, Rent>,
}

pub fn approve_nutritionist_handler(ctx: Context<ApproveNutritionistApplication>) -> Result<()> {
    let nutritionist_applicant = &mut ctx.accounts.nutritionist_applicant;
    let community_network = &mut ctx.accounts.community_network;
    let nutritionist = &mut ctx.accounts.new_nutritionist_account;
    //let program_id = id();

    // let (whitelisted_nutritionist_acc, bump_seed) = Pubkey::find_program_address(
    //     &[
    //         b"nutritionist",
    //         nutritionist_applicant.authority.key().as_ref(),
    //     ],
    //     //program_id,
    //     ctx.program_id,
    //);

    // community_network.total_whitelisted_nutritionists += 1;

    // let min_rent_lamports = ctx.accounts.rent.minimum_balance(Nutritionist::LEN);

    // let nut_app_auth = nutritionist_applicant.authority.key();

    // let seeds0: &[&[u8]] = &[
    //     b"nutritionist",
    //     nut_app_auth.as_ref(),
    // ];
    // let (nutpda, bump_seed) = Pubkey::find_program_address(seeds, &ctx.program_id);

    // let cpi_accounts = CreateAccountWithSeed {
    //     from: nutritionist_applicant.to_account_info(),
    //     to: ctx.accounts.new_nutritionist_account.to_account_info(),
    //     base: ctx
    //         .accounts
    //         .nutritionist_applicant_authority
    //         .to_account_info(),
    // };

    // let cpi_ctx = CpiContext::new(
    //     ctx.accounts.system_program.to_account_info().clone(),
    //     cpi_accounts,
    // );

    // // let seeds: &[&[u8]] = &[
    // //     b"nutritionist",
    // //     nutritionist_applicant.authority.key().as_ref(),
    // // ];
    // //let (nutpda, bump_seed) = Pubkey::find_program_address(seeds, &ctx.program_id);

    // let seed1 = "nutritionist";
    // let binding = nutritionist_applicant.authority.key().to_string();
    // let seed2 = binding.as_str();

    // // Concatenate the two seeds into a single string
    // let binding2 = format!("{}{}", seed1, seed2);
    // let combined_seed = binding2.as_str();

    // let ix = create_account_with_seed(
    //     &cpi_ctx.accounts.from.key,
    //     &cpi_ctx.accounts.to.key,
    //     &cpi_ctx.accounts.base.key,
    //     &combined_seed,
    //     min_rent_lamports,
    //     Nutritionist::LEN.try_into().unwrap(),
    //     &ctx.program_id,
    // );

    // let whitelisted_nutritionist = invoke_signed(
    //     &ix,
    //     &[
    //         cpi_ctx.accounts.from,
    //         cpi_ctx.accounts.to,
    //         cpi_ctx.accounts.base,
    //     ],
    //     cpi_ctx.signer_seeds,
    // );
    //.map_err(Into::into);

    nutritionist.authority = nutritionist_applicant.authority.key();
    nutritionist.nutritionist_token_account = nutritionist_applicant.nutritionist_token_account.key();
    nutritionist.nutritionist_nft_account = nutritionist_applicant.nutritionist_nft_account.key();
    nutritionist.id = community_network.total_whitelisted_nutritionists + 1;
    nutritionist.reputation = 0;
    nutritionist.is_whitelisted = true;
    nutritionist.bump = *ctx.bumps.get("nutritionist").unwrap();

    
    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                authority: ctx.accounts.nutritionist_nft_mint.to_account_info(),
                to: ctx.accounts.nutritionist_nft_account.to_account_info(),
                mint: ctx.accounts.nutritionist_nft_mint.to_account_info(),
            },
            &[&[
                "nutritionist-mint".as_bytes(),
                &[*ctx.bumps.get("nutritionist_mint").unwrap()],
            ]],
        ),
        1,
    )?;

    msg!("Minted nutritionist nft");

    Ok(())
}
