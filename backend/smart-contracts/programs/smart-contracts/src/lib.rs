use anchor_lang::prelude::*;

declare_id!("69LrDhtKu2M6FXuF1mqJCM9s2J427XV19QFg972MWg9A");

#[program]
pub mod smart_contracts {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
