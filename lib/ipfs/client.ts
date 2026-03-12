const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY ?? "https://ipfs.io/ipfs/";
const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY ?? "";
const PINATA_SECRET = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY ?? "";
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT_TOKEN ?? process.env.PINATA_JWT ?? "";

export function ipfsUrl(cid: string): string {
  const base = PINATA_GATEWAY.replace(/\/$/, "");
  const id = cid.replace(/^ipfs:\/\//, "");
  return `${base}/${id}`;
}

export async function uploadToIpfs(
  blob: Blob,
  filename?: string
): Promise<{ cid: string; url: string }> {
  const hasAuth = !!PINATA_JWT || (!!PINATA_API_KEY && !!PINATA_SECRET);
  if (!hasAuth) {
    throw new Error("Pinata not configured. Set NEXT_PUBLIC_PINATA_JWT_TOKEN or NEXT_PUBLIC_PINATA_API_KEY + NEXT_PUBLIC_PINATA_SECRET_API_KEY.");
  }
  const form = new FormData();
  form.append("file", blob, filename ?? "file");
  const endpoint = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const headers: Record<string, string> = {};
  if (PINATA_JWT) {
    headers["Authorization"] = `Bearer ${PINATA_JWT}`;
  } else {
    headers["pinata_api_key"] = PINATA_API_KEY;
    headers["pinata_secret_api_key"] = PINATA_SECRET;
  }
  const res = await fetch(endpoint, { method: "POST", body: form, headers });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`IPFS upload failed: ${res.status} ${t}`);
  }
  const data = await res.json();
  const cid = data.IpfsHash ?? data.cid ?? data.Hash;
  if (!cid) throw new Error("IPFS response missing CID");
  return { cid, url: ipfsUrl(cid) };
}

export async function fetchFromIpfs(cid: string): Promise<ArrayBuffer> {
  const url = ipfsUrl(cid);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`IPFS fetch failed: ${res.status}`);
  return res.arrayBuffer();
}
