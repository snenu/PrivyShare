const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY ?? "https://ipfs.io/ipfs/";

export function ipfsUrl(cid: string): string {
  const base = PINATA_GATEWAY.replace(/\/$/, "");
  const id = cid.replace(/^ipfs:\/\//, "");
  return `${base}/${id}`;
}

/**
 * Upload to IPFS via server-side API (keeps keys secure).
 * Falls back to client-side Pinata only if API fails (e.g. during static export).
 */
export async function uploadToIpfs(
  blob: Blob,
  filename?: string
): Promise<{ cid: string; url: string }> {
  const form = new FormData();
  form.append("file", blob, filename ?? "file");
  const apiRes = await fetch("/api/upload", {
    method: "POST",
    body: form,
  });
  if (apiRes.ok) {
    const data = (await apiRes.json()) as { cid: string; url: string };
    return { cid: data.cid, url: data.url ?? ipfsUrl(data.cid) };
  }
  let errMsg = `Upload failed: ${apiRes.status}`;
  try {
    const errJson = (await apiRes.json()) as { error?: string };
    if (errJson?.error) errMsg = errJson.error;
  } catch {
    // ignore
  }
  throw new Error(errMsg);
}

export async function fetchFromIpfs(cid: string): Promise<ArrayBuffer> {
  const url = ipfsUrl(cid);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`IPFS fetch failed: ${res.status}`);
  return res.arrayBuffer();
}
