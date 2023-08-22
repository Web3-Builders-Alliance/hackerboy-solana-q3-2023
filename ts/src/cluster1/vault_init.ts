import {
  Connection,
  Keypair,
  SystemProgram,
  PublicKey,
  Commitment,
} from '@solana/web3.js';
import {
  Program,
  Wallet,
  AnchorProvider,
  Address,
} from '@project-serum/anchor';
import { WbaVault, IDL } from '../programs/wba_vault';
import wallet from '../../wba-wallet.json';

const payer = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitment: Commitment = 'confirmed';
const connection = new Connection('https://api.devnet.solana.com', commitment);
const provider = new AnchorProvider(connection, new Wallet(payer), {
  commitment,
});
const program = new Program<WbaVault>(
  IDL,
  'D51uEDHLbWAxNfodfQDv7qkp8WZtxrhi3uganGbNos7o' as Address,
  provider
);
const vaultState = Keypair.generate(); /* can also be a PDA */
console.log(vaultState.publicKey);
const [vaultAuth, _vaultAuth_bump] = PublicKey.findProgramAddressSync(
  [Buffer.from('auth'), Buffer.from(vaultState.publicKey.toBuffer())],
  program.programId
);
const [vault, _vault_bump] = PublicKey.findProgramAddressSync(
  [Buffer.from('vault'), Buffer.from(vaultAuth.toBuffer())],
  program.programId
);

(async () => {
  try {
    const txId = await program.methods
      .initialize()
      .accounts({
        owner: payer.publicKey,
        vaultState: vaultState.publicKey,
        vaultAuth,
        vault,
        systemProgram: SystemProgram.programId
      })
      .signers([payer, vaultState])
      .rpc();
    /* to say that vaultState(a random keypair) is my state for the program, I need to sign with the vaultState otherwise there would be no proof to say that this public is mine*/
    console.log(`txId: ${txId}`);
  } catch (error) {
    console.log(error);
  }
})();
