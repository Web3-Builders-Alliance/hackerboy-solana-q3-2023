// Transfer 0.001 SOL from dev-wallet to WBA Wallet

use solana_client::{nonblocking::rpc_client, rpc_client::RpcClient};
use solana_program::{pubkey::Pubkey, system_instruction::transfer};
use solana_sdk::{
    signature::{read_keypair_file, Keypair, Signer},
    transaction::Transaction,
};
use std::str::FromStr;

#[test]
pub fn transfer_sol() {
    let n = 6;
    let keypair = read_keypair_file("/home/hackerboy/solana-programs/WBA-PreReqs/dev-wallet.json")
        .expect("Couldn't read the wallet file");
    let to_pubkey = Pubkey::from_str("5kRot8UnMEqoDkAc72e7pqaEaF5hxGmbDNowMmPiCDmb").unwrap();
    let client = RpcClient::new("https://api.devnet.solana.com".to_string());
    let recent_blockhash = client
        .get_latest_blockhash()
        .expect("Failed to get recent blockhash");
    let transaction = Transaction::new_signed_with_payer(
        &[transfer(&keypair.pubkey(), &to_pubkey, 1_000_000u64)],
        Some(&keypair.pubkey()),
        &vec![&keypair],
        recent_blockhash,
    );
    let signature = client
        .send_and_confirm_transaction(&transaction)
        .expect("Transaction failed");
    println!(
        "Checkc out the transaction here!\nhttps://explorer.solana.com/tx/{:?}/?cluster=devnet",
        signature
    );
}
