pub const DISCRIMINATOR_LENGTH: usize = 8;
pub const NAME_LENGTH: usize = 30 * 4;
pub const PUBKEY_LENGTH: usize = 32;
pub const NUTRITIONIST_ENUM_LENGTH: usize = 15 * 5;
pub const USER_ENUM_LENGTH: usize = 15 * 3;
pub const DATA_LENGTH: usize = 8;
pub const BOOL_LENGTH: usize = 1;
pub const BIO_LENGTH: usize = 50 * 4;
pub const LINK_LENGTH: usize = 50 * 4;


#[constant]
pub const USER_SEED: &[u8] = b"user";

#[constant]
pub const NUTRITIONIST_SEED: &[u8] = b"nutritionist";

#[constant]
pub const NUTRITIONIST_APPLICANT_SEED: &[u8] = b"nutritionist-applicant";

#[constant]
pub const COMMUNITY_NETWORK_SEED: &[u8] = b"community-network";

//update later
#[constant]
pub const COMMUNITY_NETWORK_ADMIN_PUBKEY: &str = "";

pub const COMMUNITY_NETWORK_ESCROW_PDA_SEEDS: &[u8] = b"community-escrow";
#[constant]
pub const USDC_MINT_PUBKEY: Pubkey = pubkey!("envK7QRnj5Vm7m7yrB2bTn8YUpM6AYFW7WW1NK8YgTY");
#[constant]
pub const ADMIN: Pubkey = pubkey!("");
// #[constant]
// pub const USER_SUB_AMOUNT: u64 = 50;
// #[constant]
// pub const LAMPORTS_PER_USDC: u64 = 1_000_000;

#[constant]
pub const USER_SUB_AMOUNT: u64 = 50_000_000;

pub const SEED_PROGRAM_CONFIG: &[u8] = b"program_config";
