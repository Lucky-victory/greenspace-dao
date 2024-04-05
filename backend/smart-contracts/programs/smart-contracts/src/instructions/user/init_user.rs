use anchor_lang::prelude::*;

use crate::{state::*, errors::ErrorCodes};

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

    pub community_network:  Box<Account<'info, CommunityNetwork>>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitUser>) -> Result<()> {
    let user = &mut ctx.accounts.user;
    
    user.authority = *ctx.accounts.authority.key;
    user.reputation = 0;
    user.id = *ctx.community_network.total_users + 1;
    user.user_subscription_status = UserStatus::Active;
    user.bump = *ctx.bumps.get("user").unwrap();

    Ok(())
}