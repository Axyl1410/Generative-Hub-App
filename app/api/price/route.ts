import { addPriceToToken, closeConnection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { address, tokenId, price } = await request.json();

    if (!address || !tokenId || price === undefined) {
      return NextResponse.json(
        { error: "Address, tokenId, and price are required" },
        { status: 400 }
      );
    }

    await addPriceToToken(address, tokenId, price);

    return NextResponse.json(
      { message: "Price added successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error adding price:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  } finally {
    await closeConnection();
  }
}
