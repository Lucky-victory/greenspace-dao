use anchor_lang::prelude::*;

mod constants;
mod errors;
mod instructions;
mod state;

use instructions::*;

declare_id!("HtnGh5bjJ9LCUHhVBvifGjTZC9irtqR7p3pga4a6Q8mp");

#[program]
pub mod greentest {
    use anchor_spl::token;

    use super::*;

    pub fn init_community_network(ctx: Context<InitCommunityNetwork>) -> Result<()> {
        init_community_network_handler(ctx)
    }

    pub fn approve_nutritionist(
        ctx: Context<ApproveNutritionistApplication>,
    ) -> Result<()> {
        approve_nutritionist_handler(ctx)
    }

    pub fn init_nutritionist_nft(
        ctx: Context<InitNutritionistNft>,
        token_name: String,
        token_symbol: String,
        token_uri: String,
    ) -> Result<()> {
        init_nutritionist_nft_handler(ctx, token_name, token_symbol, token_uri)
    }

    pub fn init_user_nft(
        ctx: Context<InitUserNft>,
        token_name: String,
        token_symbol: String,
        token_uri: String,
    ) -> Result<()> {
        init_user_nft_handler(ctx, token_name, token_symbol, token_uri)
    }

    pub fn close_nutritionist_account(ctx: Context<CloseNutritionistContext>) -> Result<()> {
        close_nutritionist_account_handler(ctx)
    }

    pub fn close_user_account(ctx: Context<CloseUserContext>) -> Result<()> {
        close_user_account_handler(ctx)
    }

    pub fn init_user(ctx: Context<InitUser>) -> Result<()> {
        init_user_handler(ctx)
    }

    pub fn init_nutritionist_applicant(ctx: Context<InitNutritionistApplicant>) -> Result<()> {
        init_nutritionist_applicant_handler(ctx)
    }


}
