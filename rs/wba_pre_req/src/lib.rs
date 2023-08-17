pub mod programs;
pub mod transfer;
pub mod utils;

#[cfg(test)]
mod tests {
    use crate::programs::wba_prereq::{CompleteArgs, UpdateArgs, WbaPrereqProgram};
    use solana_client::rpc_client::RpcClient;
    use solana_program::{pubkey::Pubkey, system_instruction::transfer, system_program};
    use solana_sdk::{
        message::Message,
        signature::{read_keypair_file, Keypair, Signer},
        transaction::Transaction,
    };
    use std::str::FromStr;

    const RPC_URL: &str = "https://api.devnet.solana.com";

    #[test]
    fn keygen() {
        let keypair = Keypair::new();
        println!(
            "You've generated a new Solana Wallet: {}\n",
            keypair.pubkey()
        );
        println!("To save you wallet, copy and paste the folowing into a JSON file: ");
        println!("{:?}", keypair.to_bytes());
    }
    #[test]
    fn airdrop() {
        let keypair =
            read_keypair_file("/home/hackerboy/solana-programs/WBA-PreReqs/dev-wallet.json")
                .expect("Couldn't read the wallet file");
        let client = RpcClient::new(RPC_URL.to_string());
        match client.request_airdrop(&keypair.pubkey(), 2_000_000_000u64) {
            Ok(s) => println!(
                "Airdrop successful!\nhttps://explorer.solana.com/tx/{:?}?cluster=devnet",
                s
            ),
            Err(e) => println!("Airdrop failed: {:?}", e),
        }
    }
    #[test]
    fn transfer_sol() {
        let rpc_client = RpcClient::new(RPC_URL.to_string());
        let keypair =
            read_keypair_file("/home/hackerboy/solana-programs/WBA-PreReqs/dev-wallet.json")
                .expect("Couldn't read the wallet file");
        let to_pubkey = Pubkey::from_str("5kRot8UnMEqoDkAc72e7pqaEaF5hxGmbDNowMmPiCDmb").unwrap();
        let balance = rpc_client.get_balance(&keypair.pubkey()).unwrap();
        let recent_blockhash = rpc_client.get_latest_blockhash().unwrap();
        let message = Message::new_with_blockhash(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance)],
            Some(&keypair.pubkey()),
            &recent_blockhash,
        );
        let fee = rpc_client
            .get_fee_for_message(&message)
            .expect("Failed to get fee for message");

        let transaction = Transaction::new_signed_with_payer(
            &[transfer(&keypair.pubkey(), &to_pubkey, balance - fee)],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );

        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Transaction failed");
        println!(
            "Check out the transaction here!\nhttps://explorer.solana.com/tx/{:?}/?cluster=devnet",
            signature
        );
    }

    #[test]
    pub fn complete_prereq() {
        let rpc_client = RpcClient::new(RPC_URL.to_string());
        let signer = read_keypair_file(
            "/home/hackerboy/solana-programs/WBA-PreReqs/rust/wba_pre_req/src/wba-wallet.json",
        )
        .expect("Couldn't read the wallet file");
        let prereq = WbaPrereqProgram::derive_program_address(&[
            b"prereq",
            signer.pubkey().to_bytes().as_ref(),
        ]);
        let update_args = UpdateArgs {
            github: b"raghav-rama".to_vec(),
        };
        let recent_blockhash = rpc_client
            .get_latest_blockhash()
            .expect("Failed to get recent blockhash");
        let transaction = WbaPrereqProgram::update(
            &[&signer.pubkey(), &prereq, &system_program::id()],
            &update_args,
            Some(&signer.pubkey()),
            &[&signer],
            recent_blockhash,
        );
        let signature = rpc_client
            .send_and_confirm_transaction(&transaction)
            .expect("Transaction failed");
        println!(
            "Check out the transaction here!\nhttps://explorer.solana.com/tx/{:?}/?cluster=devnet",
            signature
        );
    }
}
