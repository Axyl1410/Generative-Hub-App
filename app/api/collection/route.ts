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
    const { address } = await request.json();

    if (!address) {
      return NextResponse.json(
        { error: "Username, address and token are required" },
        { status: 400 }
      );
    }

    await addCollectionToDatabase(address);

    return NextResponse.json(
      { message: "Token added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  } finally {
    await closeConnection();
  }
}
