import { ALEO_RPC_URL, PRIVYSHARE_PROGRAM_ID } from "./config";

const PROGRAM_ID = PRIVYSHARE_PROGRAM_ID;
const BASE = ALEO_RPC_URL.replace(/\/$/, "");

export interface FileInfo {
  owner: string;
  ipfs_cid: string;
  price: string;
}

/**
 * Fetch current file counter (next file_id = counter + 1).
 * Mapping: file_counter u8 => u64, we use key 0u8.
 */
export async function getFileCounter(): Promise<number> {
  const url = `${BASE}/program/${PROGRAM_ID}/mapping/file_counter/0u8`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return 0;
    throw new Error(`Failed to fetch file_counter: ${res.status}`);
  }
  const data = await res.json();
  const value = data?.value ?? data;
  if (typeof value === "string" && /^\d+$/.test(value)) return parseInt(value, 10);
  if (typeof value === "number") return value;
  return 0;
}

/**
 * Fetch file listing for a given file_id.
 * Mapping: files u64 => file_info (owner, ipfs_cid, price).
 */
export async function getFileInfo(fileId: number): Promise<FileInfo | null> {
  const key = `${fileId}u64`;
  const url = `${BASE}/program/${PROGRAM_ID}/mapping/files/${encodeURIComponent(key)}`;
  const res = await fetch(url);
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch file ${fileId}: ${res.status}`);
  }
  const data = await res.json();
  const value = data?.value ?? data;
  if (!value || typeof value !== "object") return null;
  return {
    owner: String(value.owner ?? ""),
    ipfs_cid: String(value.ipfs_cid ?? value.ipfs_cid ?? ""),
    price: String(value.price ?? "0"),
  };
}

/**
 * List all registered files (file_id 1 through counter).
 * Fetches in parallel to avoid N+1 sequential requests.
 */
export async function listFiles(): Promise<{ fileId: number; info: FileInfo }[]> {
  const counter = await getFileCounter();
  if (counter < 1) return [];
  const ids = Array.from({ length: counter }, (_, i) => i + 1);
  const results = await Promise.all(ids.map((id) => getFileInfo(id)));
  return results
    .map((info, i) => (info ? { fileId: ids[i], info } : null))
    .filter((x): x is { fileId: number; info: FileInfo } => x !== null);
}
