import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(req: NextRequest) {
  const db = await getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const fileId = req.nextUrl.searchParams.get("fileId");
  const id = fileId ? parseInt(fileId, 10) : NaN;
  if (!fileId || isNaN(id)) {
    return NextResponse.json({ error: "Invalid fileId" }, { status: 400 });
  }
  try {
    const files = db.collection("file_metadata");
    const doc = await files.findOne({ fileId: id });
    if (!doc) return NextResponse.json(null);
    const { _id, ...meta } = doc;
    return NextResponse.json(meta);
  } catch (e) {
    console.error("Files GET error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const db = await getDb();
  if (!db) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const { fileId, ownerAddress, cid, name, description, ivBase64, saltBase64 } = body ?? {};
    const id = typeof fileId === "number" ? fileId : parseInt(String(fileId), 10);
    if (isNaN(id) || !ownerAddress || !cid) {
      return NextResponse.json({ error: "Missing fileId, ownerAddress, or cid" }, { status: 400 });
    }
    const files = db.collection("file_metadata");
    await files.updateOne(
      { fileId: id },
      {
        $set: {
          fileId: id,
          ownerAddress: String(ownerAddress),
          cid: String(cid),
          name: name ?? `File ${id}`,
          description: description ?? "",
          ivBase64: ivBase64 ?? "",
          saltBase64: saltBase64 ?? "",
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Files POST error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
