import { NextRequest, NextResponse } from "next/server";

const PINATA_JWT = process.env.PINATA_JWT ?? "";

export async function POST(req: NextRequest) {
  if (!PINATA_JWT) {
    return NextResponse.json(
      { error: "Pinata not configured. Set PINATA_JWT (server-side)." },
      { status: 500 }
    );
  }
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const body = new FormData();
    body.append("file", file, file.name || "file");
    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      body,
      headers: { Authorization: `Bearer ${PINATA_JWT}` },
    });
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Pinata upload failed: ${res.status} ${text}` },
        { status: 502 }
      );
    }
    const data = (await res.json()) as { IpfsHash?: string; cid?: string; Hash?: string };
    const cid = data.IpfsHash ?? data.cid ?? data.Hash;
    if (!cid) {
      return NextResponse.json({ error: "No CID in Pinata response" }, { status: 502 });
    }
    const gateway = process.env.NEXT_PUBLIC_PINATA_GATEWAY ?? "https://ipfs.io/ipfs/";
    const base = gateway.replace(/\/$/, "");
    const url = `${base}/${cid.replace(/^ipfs:\/\//, "")}`;
    return NextResponse.json({ cid, url });
  } catch (e) {
    console.error("Upload API error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed" },
      { status: 500 }
    );
  }
}
