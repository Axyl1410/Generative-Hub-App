import { Db, MongoClient } from "mongodb";

const uri = process.env.DB_URI; // URI kết nối đến MongoDB của bạn

let client: MongoClient;
let db: Db;

if (!uri) {
  throw new Error("Vui lòng cung cấp URI kết nối đến MongoDB");
}

async function connectToDatabase() {
  if (client) {
    return;
  }

  try {
    client = new MongoClient(uri as string);
    await client.connect();
    db = client.db("genhub"); // Tên database của bạn
    console.log("Kết nối thành công đến MongoDB");
  } catch (error) {
    console.error("Lỗi kết nối đến MongoDB:", error);
    throw error;
  }
}

export async function getCollection() {
  await connectToDatabase();
  return db.collection("genhub"); // Tên collection của bạn
}
