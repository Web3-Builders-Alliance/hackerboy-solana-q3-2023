import {
  Commitment,
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from '@solana/web3.js';
import {
  createCreateMetadataAccountV3Instruction,
  createCreateMetadataAccountV2Instruction,
  type DataV2,
  type CreateMetadataAccountV3InstructionAccounts,
  type CreateMetadataAccountV3InstructionArgs,
  type CreateMetadataAccountArgsV3,
  PROGRAM_ADDRESS,
} from '@metaplex-foundation/mpl-token-metadata';
import wallet from '../../wba-wallet.json';

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitment: Commitment = 'confirmed';
const connection = new Connection('https://api.devnet.solana.com', commitment);
const mint = new PublicKey('AEG4BEmcvHrjqJ31Gmpsr6uPENoA8LByggi75U2rT8N3');
const token_metadata_program_id = new PublicKey(PROGRAM_ADDRESS);
const metadata_seeds = [
  Buffer.from('metadata'),
  token_metadata_program_id.toBuffer(),
  mint.toBuffer(),
];
const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(
  metadata_seeds,
  token_metadata_program_id
);

(async () => {
  try {
    const accounts: CreateMetadataAccountV3InstructionAccounts = {
      metadata: metadata_pda,
      mint,
      mintAuthority: keypair.publicKey,
      payer: keypair.publicKey,
      updateAuthority: keypair.publicKey,
    };
    const data: DataV2 = {
      name: 'WBA hackerboy',
      symbol: 'WBA Boi',
      uri: 'https://raw.githubusercontent.com/raghav-rama/metaplex-token-metadata/main/wba-hackerboy-metadata.json',
      sellerFeeBasisPoints: 0,
      creators: null,
      collection: null,
      uses: null,
    };
    const metadataAccountArgsV3: CreateMetadataAccountArgsV3 = {
      data,
      isMutable: true,
      collectionDetails: null,
    };
    const args: CreateMetadataAccountV3InstructionArgs = {
      createMetadataAccountArgsV3: metadataAccountArgsV3,
    };
    const ix = createCreateMetadataAccountV3Instruction(accounts, args);
    const tx = new Transaction().add(ix);
    const txId = await sendAndConfirmTransaction(connection, tx, [keypair]);
    console.log(`Transaction Id: ${txId}`);
  } catch (error) {
    console.log(`Some Error occured ${error}`);
  }
})();
