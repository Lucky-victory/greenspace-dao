use crate::{constants::NUTRITIONIST_SEED, state::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CloseNutritionistContext<'info> {

    #[account(mut)]
    pub nutritionist: Signer<'info>,

    #[account(
        mut,
        seeds = [
            NUTRITIONIST_SEED,
            nutritionist.key().as_ref(),
        ],
        bump = nutritionist_account.bump,
        close = nutritionist, // close account and return lamports to user
    )]
    pub nutritionist_account: Account<'info, User>,
}

pub fn close_nutritionist_account_handler(_ctx: Context<CloseNutritionistContext>) -> Result<()> {
    Ok(())
}