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
  Address,BN,
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
const mint = new PublicKey('32k2QAxBtzvc92hYAby8s9En9PyJNYj5Ww7QnsSELYDs');
const ownerAta = new PublicKey('4gniBCayD9BAccwNUnbg8MKaxPm2o9CpEK25XYzkQx6m');
const token_decimals = 1_000_000n;
(async () => {
  const amount = 100n * token_decimals;
  const ata = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    vaultAuth,
    true,
    commitment
  );
  console.log(`ata: ${ata.address.toBase58()}`);
  let txId = await mintTo(
    connection,
    payer,
    mint,
    ata.address,
    payer.publicKey,
    amount
  );
  console.log(`minted ${amount} tokens to ${vaultAuth}, txId: ${txId}`);
  txId = await program.methods
    .depositSpl(new BN(1))
    .accounts({
      owner: payer.publicKey,
      vaultState,
      vaultAuth,
      systemProgram: SystemProgram.programId,
      ownerAta,
      vaultAta: ata.address,
      tokenMint: mint,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
    })
    .signers([payer])
    .rpc();
    console.log(`txId: ${txId}`);
})();
