use anchor_lang::prelude::*;

declare_id!("6pYu5mRNehST4KkwUzcEKt47Km9qNAvmCtdRtTjEanDG");

#[program]
pub mod veilpay {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
