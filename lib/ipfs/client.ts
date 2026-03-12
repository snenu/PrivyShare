const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY ?? "https://ipfs.io/ipfs/";
const IPFS_API_URL = process.env.NEXT_PUBLIC_IPFS_API_URL ?? "";
const IPFS_API_KEY = process.env.NEXT_PUBLIC_IPFS_API_KEY ?? "";
const IPFS_API_SECRET = process.env.NEXT_PUBLIC_IPFS_API_SECRET ?? "";

export function ipfsUrl(cid: string): string {
  const base = IPFS_GATEWAY.replace(/\/$/, "");
  const id = cid.replace(/^ipfs:\/\//, "");
  return `${base}/${id}`;
}

export async function uploadToIpfs(
  blob: Blob,
  filename?: string
): Promise<{ cid: string; url: string }> {
  if (!IPFS_API_URL || !IPFS_API_KEY) {
    throw new Error("IPFS API not configured. Set NEXT_PUBLIC_IPFS_API_URL and NEXT_PUBLIC_IPFS_API_KEY.");
  }
  const form = new FormData();
  form.append("file", blob, filename ?? "file");
  const isPinata = IPFS_API_URL.includes("pinata") || !!IPFS_API_KEY;
  const endpoint = isPinata
    ? "https://api.pinata.cloud/pinning/pinFileToIPFS"
    : `${(IPFS_API_URL || "https://ipfs.infura.io:5001").replace(/\/$/, "")}/api/v0/add`;
  const headers: Record<string, string> = {};
  if (isPinata) {
    if (IPFS_API_SECRET) {
      headers["pinata_api_key"] = IPFS_API_KEY;
      headers["pinata_secret_api_key"] = IPFS_API_SECRET;
    } else {
      headers["Authorization"] = `Bearer ${IPFS_API_KEY}`;
    }
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
