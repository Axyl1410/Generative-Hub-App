/* eslint-disable @typescript-eslint/no-explicit-any */
import { NFT } from "@/types";
import { Db, MongoClient } from "mongodb";

const uri = process.env.DB_URI;

let client: MongoClient | null;
let db: Db | null;

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

  const user = await collection.findOne({ username }).catch((error) => {
    throw new Error(error);
  });

  return user || null;
}

export async function addAddressToUser(username: string, address: string) {
  const collection = await getCollection();

  const user = await collection.findOne({ username });

  if (user) {
    await collection
      .updateOne({ username }, { $addToSet: { address: address } })
      .catch((error) => {
        throw new Error(error);
      });
  } else {
    await collection
      .insertOne({
        username,
        address: [address],
      })
      .catch((error) => {
        throw new Error(error);
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

  const nftIndex = user.nft?.findIndex(
    (nft: NFT): boolean => nft.contract === contract
  );

  if (nftIndex === -1) {
    await collection
      .updateOne(
        { username },
        {
          $addToSet: {
            nft: {
              contract,
              tokenId: [tokenId],
            },
          },
        }
      )
      .catch((error) => {
        throw new Error(error);
      });
  } else {
    const nft = user.nft[nftIndex];
    if (nft.tokenId.includes(tokenId)) {
      throw new Error("NFT already exists for this user");
    }

    await collection
      .updateOne(
        { username, "nft.contract": contract },
        {
          $addToSet: {
            "nft.$.tokenId": tokenId,
          },
        }
      )
      .catch((error) => {
        throw new Error(error);
      });
  }
}

export async function removeNftFromUser(
  username: string,
  contract: string,
  tokenId: string
) {
  const collection = await getCollection();

  const user = await collection.findOne({ username });

  if (!user) throw new Error("User not found");

  const nftIndex = user.nft?.findIndex(
    (nft: NFT): boolean => nft.contract === contract
  );

  if (nftIndex === -1) {
    throw new Error("NFT not found for this user");
  }

  const nft = user.nft[nftIndex];
  const tokenIdIndex = nft.tokenId.indexOf(tokenId);

  if (tokenIdIndex === -1) {
    throw new Error("Token ID not found for this contract");
  }

  nft.tokenId.splice(tokenIdIndex, 1);

  if (nft.tokenId.length === 0) {
    await collection
      .updateOne({ username }, {
        $pull: {
          nft: { contract },
        },
      } as any)
      .catch((error) => {
        throw new Error(error);
      });
  } else {
    await collection
      .updateOne(
        { username, "nft.contract": contract },
        {
          $set: {
            "nft.$.tokenId": nft.tokenId,
          },
        }
      )
      .catch((error) => {
        throw new Error(error);
      });
  }
}
