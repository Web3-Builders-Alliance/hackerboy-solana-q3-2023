import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import { Keypair, PublicKey, Connection, Commitment } from '@solana/web3.js';
import wallet from '../../wba-wallet.json';

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitment: Commitment = 'confirmed';
const connection = new Connection('https://api.devnet.solana.com', commitment);
const token_decimals = 1_000_000n;
const mint = new PublicKey('AEG4BEmcvHrjqJ31Gmpsr6uPENoA8LByggi75U2rT8N3');
(async () => {
  try {
    const ata = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      keypair.publicKey,
      false,
      commitment
    );
    console.log(`Your ATA is: ${ata.address.toBase58()}`);
    const amount = 100n * token_decimals;
    const txId = await mintTo(
      connection,
      keypair,
      mint,
      new PublicKey(ata.address),
      keypair.publicKey,
      amount,
    );
    console.log(`Minted ${amount} tokens to ${ata.address.toBase58()}`);
    console.log(`Transaction ID: ${txId}`);

  } catch (e) {
    console.log(`Some error occurred: ${e}`);
  }
})();
