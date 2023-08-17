import { Connection, Keypair, Commitment, PublicKey } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, transfer } from '@solana/spl-token';
import wallet from '../../wba-wallet.json';

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));
const commitment: Commitment = 'confirmed';
const connection = new Connection('https://api.devnet.solana.com', commitment);
const mint = new PublicKey('AEG4BEmcvHrjqJ31Gmpsr6uPENoA8LByggi75U2rT8N3');
const to_japarjam = new PublicKey(
  'BvhV49WPYBbzPu8Fpy8YnPnwhNWLbm9Vmdj2T5bNSotS'
);
const to_s6thgehr = new PublicKey(
  'B8ZcFLg7ddkRR6cyoBcJWGSY9sWgckX7FVssSy9CY36x'
);
const to_ez_krk = new PublicKey('7sydHcmax59DZJ523tFQEakwkJ3vBDWUE64auHy7yn1N');

(async () => {
  try {
    const ata_japarjam = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to_japarjam
    );
    const ata_s6thgehr = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to_s6thgehr
    );
    const ata_ez_krk = await getOrCreateAssociatedTokenAccount(
      connection,
      keypair,
      mint,
      to_ez_krk
    );
    const amount = 10n * 1_000_000n;
    const txId_japarjam = await transfer(
      connection,
      keypair,
      new PublicKey('4gniBCayD9BAccwNUnbg8MKaxPm2o9CpEK25XYzkQx6m'),
      new PublicKey(ata_japarjam.address),
      keypair.publicKey,
      amount
    );
    console.log(`Transaction ID: ${txId_japarjam}`);
    const txId_s6thgehr = await transfer(
      connection,
      keypair,
      new PublicKey('4gniBCayD9BAccwNUnbg8MKaxPm2o9CpEK25XYzkQx6m'),
      new PublicKey(ata_s6thgehr.address),
      keypair.publicKey,
      amount
    );
    console.log(`Transaction ID: ${txId_s6thgehr}`);
    const txId_ez_krk = await transfer(
      connection,
      keypair,
      new PublicKey('4gniBCayD9BAccwNUnbg8MKaxPm2o9CpEK25XYzkQx6m'),
      new PublicKey(ata_ez_krk.address),
      keypair.publicKey,
      amount
    );
    console.log(`Transaction ID: ${txId_ez_krk}`);
  } catch (e) {
    console.log(`Some error occured ${e}`);
  }
})();
