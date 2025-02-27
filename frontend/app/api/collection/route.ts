import {
  addCollectionToDatabase,
  closeConnection,
  getAllCollections,
} from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = await getAllCollections();

    if (!collection) {
      return NextResponse.json(
        { error: "Collection not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(collection);
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error ${error}` },
      { status: 500 }
    );
  } finally {
    await closeConnection();
  }
}

export async function POST(request: Request) {
  try {
    const { address, name } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    const collectionData = {
      address,
      ...(name && { name }), // Only include name if it exists
    };

    await addCollectionToDatabase(collectionData);

    return NextResponse.json(
      { message: "Collection added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding collection:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  } finally {
    await closeConnection();
  }
}
