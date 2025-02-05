/* eslint-disable @typescript-eslint/no-explicit-any */
import { Db, MongoClient } from "mongodb";

const uri = process.env.DB_URI;

let client: MongoClient | null;
let db: Db | null;

type NFT = {
  contract: string;
  tokenId: string;
};

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
  return db!.collection(collectionName);
}

export async function getCollectionbyusername(username: string) {
  const collection = await getCollection();

  const user = await collection.findOne({ username });

  return user || null;
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

export async function addNftToUser(
  username: string,
  contract: string,
  tokenId: string
) {
  const collection = await getCollection();

  const user = await collection.findOne({ username });

  if (!user) throw new Error("User not found");

  const nftExists = user.nft?.some(
    (nft: NFT): boolean => nft.contract === contract && nft.tokenId === tokenId
  );

  if (nftExists) {
    console.log("NFT already exists for this user");
    return null;
  }

  await collection.updateOne(
    { username: username },
    {
      $addToSet: {
        nft: {
          contract: contract,
          tokenId: tokenId,
        },
      },
    }
  );
}

export async function RemoveNftToUser(
  username: string,
  contract: string,
  tokenId: string
) {
  const collection = await getCollection();

  const user = await collection.findOne({ username });

  if (!user) throw new Error("User not found");

  const nftExists = user.nft?.some(
    (nft: NFT): boolean => nft.contract === contract && nft.tokenId === tokenId
  );

  if (!nftExists) {
    console.log("NFT does not exist for this user");
    return null;
  }

  await collection.updateOne({ username: username }, {
    $pull: {
      nft: {
        contract: contract,
        tokenId: tokenId,
      },
    },
  } as any);
}
