use crate::{constants::USER_SEED, state::*};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct CloseUserContext<'info> {
    
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [
            USER_SEED,
            user.key().as_ref(),
        ],
        bump = user_account.bump,
        close = user, // close account and return lamports to user
    )]
    pub user_account: Account<'info, User>,
}

pub fn close_user_account_handler(_ctx: Context<CloseUserContext>) -> Result<()> {
    Ok(())
}