/**
 * Server-side verification of file ownership via Aleo RPC.
 * Used by API routes to authenticate metadata writes/reads.
 */
import { getFileInfo } from "./programState";

/**
 * Verify that the given address is the on-chain owner of the file.
 * Returns true only if the file exists and info.owner matches.
 */
export async function verifyFileOwner(
  fileId: number,
  address: string
): Promise<boolean> {
  const info = await getFileInfo(fileId);
  if (!info) return false;
  const normalized = address.trim().toLowerCase();
  const ownerNormalized = info.owner.trim().toLowerCase();
  return normalized === ownerNormalized;
}
