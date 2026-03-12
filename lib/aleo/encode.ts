/**
 * Encode an IPFS CID (or any string) to a Leo field value.
 * Leo field is a large integer; we use a deterministic hash so the same CID maps to the same field.
 * The actual CID is stored off-chain; the chain stores this commitment for listing/dedup.
 */
export function cidToField(cid: string): string {
  let h = 0;
  const s = cid + "privyshare";
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    h = (h << 5) - h + c;
    h |= 0;
  }
  const u = Math.abs(h);
  const big = BigInt(u) * BigInt(1e10) + BigInt(u.toString().length);
  return big.toString();
}
