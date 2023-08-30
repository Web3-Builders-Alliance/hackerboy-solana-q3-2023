// NOT WORKING

import * as bs58 from 'bs58';
import * as crypto from 'crypto';
import test, { describe, it } from 'node:test';

describe('Keypair', () => {
  it('can generate a keypair with a custom prefix', () => {
    const privateKey = crypto.randomBytes(32);
    const publicKey = crypto.createPublicKey(Buffer.from(privateKey)).export();
    const prefix = 'WBA';
    const prefixedBytes = Buffer.concat([Buffer.from(prefix), publicKey]);
    const checkum = crypto.createHash('sha256').update(prefixedBytes).digest();
    const doubleChecksum = crypto
      .createHash('sha256')
      .update(checkum)
      .digest()
      .slice(0, 4);
    const extendedBytes = Buffer.concat([prefixedBytes, doubleChecksum]);
    const bs58String = bs58.encode(extendedBytes);
    console.log(bs58String);
  });
});
