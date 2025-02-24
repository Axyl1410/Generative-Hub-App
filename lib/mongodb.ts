/* eslint-disable @typescript-eslint/no-explicit-any */
import { NFT } from "@/types";
import { Db, MongoClient } from "mongodb";

const uri = process.env.DB_URI;

let client: MongoClient | null;
let db: Db | null;

interface AddressData {
  address: string;
  name?: string;
}

// Add interface for collection data
interface CollectionData {
  address: string;
  name?: string;
}

if (!uri) throw new Error("Please define DB_URI in your environment variables");

async function connectToDatabase(dbname: string = "genhub") {
  if (client && db) return;

  try {
    client = new MongoClient(uri as string);
    await client.connect();
    db = client.db(dbname);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function closeConnection() {
  if (client) {
    await client.close();
    client = null;
    db = null;
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

export async function addAddressToUser(
  username: string,
  addressData: AddressData
) {
  const collection = await getCollection();
  const user = await collection.findOne({ username });

  if (user) {
    // Check if address already exists
    const existingAddress = user.address?.find(
      (addr: AddressData) => addr.address === addressData.address
    );

    if (existingAddress) {
      // Update existing address metadata
      await collection
        .updateOne(
          {
            username,
            "address.address": addressData.address,
          },
          {
            $set: {
              "address.$.name": addressData.name,
            },
          }
        )
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      // Add new address with metadata
      await collection
        .updateOne(
          { username },
          {
            $addToSet: {
              address: addressData,
            },
          }
        )
        .catch((error) => {
          throw new Error(error);
        });
    }
  } else {
    // Create new user with address
    await collection
      .insertOne({
        username,
        address: [addressData],
        nft: [],
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

  if (user.address.includes(contract))
    throw new Error("Contract is already in user's addresses");

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

  if (user.address.includes(contract))
    throw new Error("Contract is already in user's addresses");

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

// Update the function to accept collection metadata
export async function addCollectionToDatabase(collectionData: CollectionData) {
  const collection = await getCollection("collection");

  try {
    await collection
      .updateOne(
        { _id: { $exists: true } },
        {
          $addToSet: {
            allCollection: {
              address: collectionData.address,
              name: collectionData.name,
            },
          },
        },
        { upsert: true }
      )
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    throw error;
  }
}

export async function getAllCollections() {
  const collection = await getCollection("collection");
  const result = await collection.findOne({ _id: { $exists: true } });
  return result?.allCollection || [];
}

export async function addPriceToToken(
  address: string,
  tokenId: string,
  price: number
) {
  const collection = await getCollection("prices");

  const document = await collection.findOne({ address });

  if (!document) {
    // Create a new document if address does not exist
    await collection
      .insertOne({
        address,
        tokenID: {
          Id: tokenId,
          prices: [price],
        },
      })
      .catch((error) => {
        throw new Error(error);
      });
  } else {
    // Check if tokenId exists in the document
    const tokenIndex = document.tokenID.findIndex(
      (token: any) => token.Id === tokenId
    );

    if (tokenIndex === -1) {
      // Add new tokenId if it does not exist
      await collection
        .updateOne(
          { address },
          {
            $addToSet: {
              tokenID: {
                Id: tokenId,
                prices: [price],
              },
            },
          }
        )
        .catch((error) => {
          throw new Error(error);
        });
    } else {
      // Add price to existing tokenId
      await collection
        .updateOne(
          { address, "tokenID.Id": tokenId },
          {
            $addToSet: {
              "tokenID.$.prices": price,
            },
          }
        )
        .catch((error) => {
          throw new Error(error);
        });
    }
  }
}

export async function addMonthlyPrice(
  address: string,
  tokenId: string,
  price: number
) {
  const collection = await getCollection("monthlyPrices");

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date()
    .toLocaleString("default", { month: "long" })
    .toLowerCase();

  const document = await collection.findOne({
    address,
    tokenId,
    year: currentYear,
  });

  if (!document) {
    // Create a new document if address, tokenId, and year do not exist
    const monthlyPrices: Record<string, number[]> = {
      january: [],
      february: [],
      march: [],
      april: [],
      may: [],
      june: [],
      july: [],
      august: [],
      september: [],
      october: [],
      november: [],
      december: [],
    };
    monthlyPrices[currentMonth as keyof typeof monthlyPrices].push(price);

    await collection
      .insertOne({
        address,
        tokenId,
        year: currentYear,
        monthlyPrices,
      })
      .catch((error) => {
        throw new Error(error);
      });
  } else {
    // Update the existing document
    const updateQuery = {
      $push: {
        [`monthlyPrices.${currentMonth}`]: price,
      },
    } as any;

    await collection
      .updateOne({ address, tokenId, year: currentYear }, updateQuery)
      .catch((error) => {
        throw new Error(error);
      });
  }
}
