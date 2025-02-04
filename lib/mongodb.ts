import { Db, MongoClient } from "mongodb";

const uri = process.env.DB_URI;

let client: MongoClient;
let db: Db;

if (!uri) throw new Error("Please define DB_URI in your environment variables");

async function connectToDatabase(dbname: string = "genhub") {
  if (client && db) return;

  try {
    client = new MongoClient(uri as string);
    await client.connect();
    db = client.db(dbname);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCollection(collectionName: string = "genhub") {
  await connectToDatabase();
  return db.collection(collectionName);
}

export async function getCollectionbyusername(username: string) {
  const collection = await getCollection();

  const user = await collection.findOne({ username });

  if (user) return user;

  return "User not found";
}

export async function addAddressToUser(username: string, address: string) {
  const collection = await getCollection();

  const user = await collection.findOne({ username });

  if (user) {
    // User exists, update the address array. Use $addToSet to avoid duplicates.
    await collection.updateOne(
      { username },
      { $addToSet: { address: address } }
    );
  } else {
    // User doesn't exist, create a new user with the address.
    await collection.insertOne({
      username,
      address: [address], // Initialize addresses as an array
    });
  }
}
