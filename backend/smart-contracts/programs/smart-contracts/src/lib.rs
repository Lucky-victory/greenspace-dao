use anchor_lang::prelude::*;

declare_id!("HtnGh5bjJ9LCUHhVBvifGjTZC9irtqR7p3pga4a6Q8mp");

#[program]
pub mod greentest {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
