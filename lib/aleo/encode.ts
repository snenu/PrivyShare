/**
 * Encode an IPFS CID to a Leo field value using SHA-256.
 * Uses first 248 bits of hash to avoid collision risk (vs 32-bit DJB2).
 */
export async function cidToField(cid: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(cid + "privyshare");
  const hash = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(hash);
  let big = BigInt(0);
  for (let i = 0; i < Math.min(31, bytes.length); i++) {
    big = big * BigInt(256) + BigInt(bytes[i]);
  }
  return big.toString();
}
