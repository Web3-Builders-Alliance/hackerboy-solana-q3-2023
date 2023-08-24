import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { Keypair, PublicKey, Connection, Commitment } from '@solana/web3.js';
import wallet from '../../wba-wallet.json';

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitment: Commitment = 'confirmed';
const connection = new Connection('https://api.devnet.solana.com', commitment);
const token_decimals = 1_000_000n;
const mint = new PublicKey('32k2QAxBtzvc92hYAby8s9En9PyJNYj5Ww7QnsSELYDs');
// const mint = new PublicKey('HVMYmUKgtUWPYVxbMZo15tHFim3XP6YHYTfxxecX8Bua');
(async () => {
  try {
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      new PublicKey('5cXUoB856wWWfyigUPmfTMUNVLBSn8gF1dNYk6y35p2M'),
      true,
      commitment
    );
    console.log(`Your ATA is: ${ata.address.toBase58()}`);
    const amount = 100n * token_decimals;
    const txId = await mintTo(
      connection,
      keypair,
      mint,
      new PublicKey(ata.address),
      new PublicKey('5cXUoB856wWWfyigUPmfTMUNVLBSn8gF1dNYk6y35p2M'),
      amount
    );
    console.log(
      `Minted ${amount / token_decimals} tokens to ${ata.address.toBase58()}`
    );
    console.log(`Transaction ID: ${txId}`);
  } catch (e) {
    console.log(`Some error occurred: ${e}`);
  }
})();
