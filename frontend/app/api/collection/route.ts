import {
  addCollectionToDatabase,
  closeConnection,
  getAllCollections,
} from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  address: z.string().nonempty(),
  name: z.string().nonempty(),
});

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
    const body = await request.json();
    const result = postSchema.safeParse(body);

    if (!result.success) {
      const errorMessages = result.error.format();
      return NextResponse.json(
        {
          error: "Validation error",
          details: errorMessages,
        },
        { status: 400 }
      );
    }

    const { address, name } = result.data;

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
