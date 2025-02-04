import { Db, MongoClient } from "mongodb";

const uri = process.env.DB_URI;

let client: MongoClient;
let db: Db;

if (!uri) {
  throw new Error("Please define DB_URI in your environment variables");
}

async function connectToDatabase() {
  if (client) {
    return;
  }

  try {
    client = new MongoClient(uri as string);
    await client.connect();
    db = client.db("genhub");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getCollection() {
  await connectToDatabase();
  return db.collection("genhub");
}

export async function addAddressToUser(username: string, address: string) {
  const collection = await getCollection();

  const user = await collection.findOne({ username });

  if (user) {
    // User exists, update the address array. Use $addToSet to avoid duplicates.
    await collection.updateOne(
      { username },
      { $addToSet: { addresses: address } }
    );
    console.log(`Address added to user ${username}`);
  } else {
    // User doesn't exist, create a new user with the address.
    await collection.insertOne({
      username,
      addresses: [address], // Initialize addresses as an array
    });
    console.log(`User ${username} created with address`);
  }
}
