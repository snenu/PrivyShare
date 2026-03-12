/**
 * Validates required environment variables. Call at startup or in API routes.
 * Throws if critical vars are missing.
 */
export function validateEnv(): { ok: true } | { ok: false; missing: string[] } {
  const missing: string[] = [];
  const rpc = process.env.NEXT_PUBLIC_ALEO_RPC_URL;
  const programId = process.env.NEXT_PUBLIC_PRIVYSHARE_PROGRAM_ID;
  const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY;

  if (!rpc?.trim()) missing.push("NEXT_PUBLIC_ALEO_RPC_URL");
  if (!programId?.trim()) missing.push("NEXT_PUBLIC_PRIVYSHARE_PROGRAM_ID");
  if (!gateway?.trim()) missing.push("NEXT_PUBLIC_PINATA_GATEWAY");

  if (missing.length > 0) {
    return { ok: false, missing };
  }
  return { ok: true };
}
