import { addCollectionToDatabase } from "@/lib/mongodb";
import { NextResponse } from "next/server";

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
  }
}
