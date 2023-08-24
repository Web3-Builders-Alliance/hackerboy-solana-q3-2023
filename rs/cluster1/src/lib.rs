pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[cfg(test)]
mod tests {
    use super::*;
    use solana_client::nonblocking::rpc_client::RpcClient;
    use solana_program::pubkey::Pubkey;
    use solana_sdk::signature::{read_keypair_file, Signer};
    use solana_sdk::transaction::Transaction;
    use spl_token::instruction::initialize_mint;
    // use spl_token::instruction::TokenInstruction::{self, InitializeMint};
    // use spl_token::processor::Processor;
    use spl_token::ID;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }

    #[tokio::test(flavor = "multi_thread", worker_threads = 12)]
    async fn airdrop<'a>() {
        let client = RpcClient::new("https://api.devnet.solana.com".to_string());
        let keypair = read_keypair_file(
            "/home/hackerboy/solana-programs/WBA-PreReqs/rs/cluster1/src/wba-wallet.json",
        )
        .expect("Couldn't read the wallet file");
        match client
            .request_airdrop(&keypair.pubkey(), 2_000_000_000u64)
            .await
        {
            Ok(s) => println!(
                "Airdrop successful!\nhttps://explorer.solana.com/tx/{:?}?cluster=devnet",
                s
            ),
            Err(e) => println!("Airdrop failed: {:?}", e),
        }
        // let ix: TokenInstruction<'a> = InitializeMint {
        //     decimals: 6,
        //     mint_authority: keypair.pubkey(),
        //     freeze_authority: None.into(),
        // };
        let mint = Pubkey::new_unique();
        println!("Mint: {:?}", mint);

        let ix = initialize_mint(&ID, &mint, &keypair.pubkey(), None, 6).unwrap();
        let recent_blockhash = client.get_latest_blockhash().await.unwrap();
        let tx = Transaction::new_signed_with_payer(
            &[ix],
            Some(&keypair.pubkey()),
            &vec![&keypair],
            recent_blockhash,
        );
        let tx_id = client.send_and_confirm_transaction(&tx).await.unwrap();
        println!(
            "Check out the transaction here!\nhttps://explorer.solana.com/tx/{:?}/?cluster=devnet",
            tx_id
        );
    }
}
