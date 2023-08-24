import {
  Keypair,
  PublicKey,
  Connection,
  Commitment,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from '@solana/web3.js';
import {
  Program,
  Wallet,
  AnchorProvider,
  Address,
  BN,
} from '@coral-xyz/anchor';
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
const vaultState = new PublicKey(
  '5oSurGpnKu92rTmNEwUMyKbKTyXeyWHYBbqBV1EW9j71'
);
const [vaultAuth, _vaultAuth_bump] = PublicKey.findProgramAddressSync(
  [Buffer.from('auth'), Buffer.from(vaultState.toBuffer())],
  program.programId
);
const [vault, _vault_bump] = PublicKey.findProgramAddressSync(
  [Buffer.from('vault'), vaultAuth.toBuffer()],
  program.programId
);

(async () => {
  try {
    const txId = await program.methods
      .deposit(new BN(0.1 * LAMPORTS_PER_SOL))
      .accounts({
        owner: payer.publicKey,
        vault,
        vaultAuth,
        vaultState,
        systemProgram: SystemProgram.programId,
      })
      .signers([payer])
      .rpc();
    console.log(`txId: ${txId}`);
  } catch (error) {
    console.log(`some error occurerd ${error}`);
  }
})();
