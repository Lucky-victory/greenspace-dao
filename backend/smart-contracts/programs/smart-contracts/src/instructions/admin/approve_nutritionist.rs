use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, Mint, MintTo, Token, TokenAccount};
use crate::{errors::ErrorCodes, state::*};
use crate::solana_program::system_instruction::{create_account_with_seed, invoke_signed};

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
        bump = nutritionist_applicant.bump,
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

    // #[account(
    //     mut,
    //     init_if_needed,
    //     payer = authority,
    //     associated_token::mint = nutritionist_nft_mint,
    //     associated_token::authority = authority
    // )]
    // pub nutritionist_nft_account: Account<'info, TokenAccount>,

    #[account(mut
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

impl<'info> ApproveNutritionistApplication<'info> {
    fn init_nutritionist_context(
        &self, whitelisted_nutritionist: Pubkey
    ) -> CpiContext<'_, '_, '_, 'info, CreateAccountWithSeed<'info>> {
       
        let cpi_accounts = CreateAccountWithSeed {
        from: ctx.accounts.authority.to_account_info(),
        to: ctx.accounts.whitelisted_nutritionist.to_account_info(),
        base: ctx.program_id,
        };

        CpiContext::new(self.system_program.to_account_info().clone(), cpi_accounts)
    }
}

pub fn handler(ctx: Context<ApproveNutritionistApplication>) -> Result<()> {
    let nutritionist_applicant = &mut ctx.accounts.nutritionist_applicant;
    let community_network = &mut ctx.accounts.community_network;
    let program_id = id();

    let (whitelisted_nutritionist, bump_seed) = Pubkey::find_program_address(
        &[b"nutritionist", nutritionist_applicant.authority.pubkey()/*.as_ref()*/],
        //program_id,
        ctx.program_id
    );

    whitelisted_nutritionist = Nutritionist{
        authority: nutritionist_applicant.authority.key(),
        nutritionist_token_account:  nutritionist_applicant.nutritionist_token_account.key(),
        id: *community_network.total_whitelisted_nutritionists + 1,
        reputation: 0,
        nutritionist_nft_account: nutritionist_applicant.nutritionist_nft_account.key(),
        is_whitelisted: true,
        bump: bump_seed
    };

    community_network.total_whitelisted_nutritionists += 1;

    let min_rent_lamports = rent.minimum_balance(Nutritionist::LEN);

    let cpi_ctx = ctx.accounts.init_nutritionist_context(whitelisted_nutritionist);   

    let ix = create_account_with_seed(
        cpi_ctx.accounts.from.key,
        cpi_ctx.accounts.to.key,
        cpi_ctx.accounts.base.key,
        b"nutritionist",
        min_rent_lamports,
        Nutritionist::LEN,
        ctx.program_id
    );

    invoke_signed(
        &ix,
        &[cpi_ctx.accounts.from, cpi_ctx.accounts.to, cpi_ctx.accounts.base],
        cpi_ctx.signer_seeds,
    )
    .map_err(Into::into);

    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                authority: nutritionist_applicant.nutritionist_nft_mint.to_account_info(),
                to: nutritionist_applicant.nutritionist_nft_account.to_account_info(),
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
