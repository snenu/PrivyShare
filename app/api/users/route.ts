import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const db = await getDb();
  if (!db) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  try {
    const body = await req.json();
    const address = typeof body?.address === "string" ? body.address.trim() : "";
    if (!address || !address.startsWith("aleo1")) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }
    const users = db.collection("users");
    await users.updateOne(
      { address },
      { $set: { address, updatedAt: new Date() } },
      { upsert: true }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Users API error:", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
