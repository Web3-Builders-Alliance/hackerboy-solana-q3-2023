use bs58;
use std::io::{self, BufRead};

#[test]
pub fn base58_to_wallet() {
    println!("Enter your private key as bse58: ");
    let stdin = io::stdin();
    let base58 = stdin.lock().lines().next().unwrap().unwrap();
    println!("\nYour wallet file is: ");
    let wallet = bs58::decode(base58).into_vec().unwrap();
    println!("{:?}", wallet);
}

#[test]
pub fn wallet_to_base58() {
    println!("Enter you private key in a byte array: ");
    let stdin = io::stdin();
    let wallet = stdin
        .lock()
        .lines()
        .next()
        .unwrap()
        .unwrap()
        .trim_start_matches('[')
        .trim_end_matches(']')
        .split(',')
        .map(|s| s.trim().parse::<u8>().unwrap())
        .collect::<Vec<u8>>();
    println!("Your base58 key is: ");
    let base58 = bs58::encode(wallet).into_string();
    println!("{}", base58);
}
