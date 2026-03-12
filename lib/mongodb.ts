import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI ?? "";
let client: MongoClient | null = null;
let db: Db | null = null;

export async function getDb(): Promise<Db | null> {
  if (!uri) return null;
  if (db) return db;
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db("privyshare");
    return db;
  } catch (e) {
    console.error("MongoDB connect error:", e);
    return null;
  }
}

export async function closeDb(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}
