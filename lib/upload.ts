import { encryptFile } from "@/lib/crypto/encrypt";
import { uploadToIpfs } from "@/lib/ipfs/client";

export interface EncryptedUploadResult {
  cid: string;
  ivBase64: string;
  saltBase64: string;
  url: string;
}

/**
 * Encrypt file with password and upload ciphertext to IPFS.
 * Returns CID and decryption params (iv, salt) to store for later download.
 */
export async function encryptAndUpload(
  file: File,
  password: string
): Promise<EncryptedUploadResult> {
  const buf = await file.arrayBuffer();
  const { ciphertext, iv, salt } = await encryptFile(buf, password);
  const blob = new Blob([ciphertext as BlobPart], { type: "application/octet-stream" });
  const { cid, url } = await uploadToIpfs(blob, file.name);
  const toBase64 = (u: Uint8Array) => {
    let s = "";
    for (let i = 0; i < u.length; i++) s += String.fromCharCode(u[i]);
    return btoa(s);
  };
  return {
    cid,
    url,
    ivBase64: toBase64(iv),
    saltBase64: toBase64(salt),
  };
}

export function decodeBase64ToUint8(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

