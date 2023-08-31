import {
  Connection,
  Keypair,
  PublicKey,
  LAMPORTS_PER_SOL,
  SystemProgram,
  Commitment,
} from '@solana/web3.js';
import {
  Program,
  Wallet,
  AnchorProvider,
  Address,
  BN,
} from '@coral-xyz/anchor';
import { WbaVault, IDL } from '../programs/wba_vault_program';
import wallet from '../../wba-wallet.json';
import {
  getOrCreateAssociatedTokenAccount,
  mintTo,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';

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
  [Buffer.from('vault'), Buffer.from(vaultAuth.toBuffer())],
  program.programId
);
const mint = new PublicKey('AEG4BEmcvHrjqJ31Gmpsr6uPENoA8LByggi75U2rT8N3');
// const ownerAta = new PublicKey('4gniBCayD9BAccwNUnbg8MKaxPm2o9CpEK25XYzkQx6m');
const token_decimals = 1_000_000n;
(async () => {
  const amount = 100n * token_decimals;
  const ownerAta = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );
  const vaultAta = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    vaultAuth,
    true,
    commitment
  );
  // let txId;
  console.log(`vaultAta: ${vaultAta.address.toBase58()}`);
  console.log(`ownerAta: ${ownerAta.address.toBase58()}`);
  const txId = await program.methods
    .depositSpl(new BN(1e6))
    .accounts({
      owner: payer.publicKey,
      vaultState,
      vaultAuth,
      systemProgram: SystemProgram.programId,
      ownerAta: ownerAta.address,
      vaultAta: vaultAta.address,
      tokenMint: mint,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
  console.log(`txId: ${txId}`);
})();
