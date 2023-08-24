import { Keypair, Connection, Commitment } from '@solana/web3.js';
import { createMint } from '@solana/spl-token';
import wallet from '../../wba-wallet.json';
import { PublicKey } from '@metaplex-foundation/js';

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitment: Commitment = 'confirmed';
const connection = new Connection('https://api.devnet.solana.com', commitment);

(async () => {
  try {
    const mint = await createMint(
      connection,
      keypair,
      new PublicKey("5cXUoB856wWWfyigUPmfTMUNVLBSn8gF1dNYk6y35p2M"),
      null,
      6,
    );
    console.log(mint);
  } catch (e) {
    console.log(`Some error occurred: ${e}`);
  }
})();
