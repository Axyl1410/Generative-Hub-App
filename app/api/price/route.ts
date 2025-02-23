import { addMonthlyPrice, closeConnection } from "@/lib/mongodb";
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

    await addMonthlyPrice(address, tokenId, price);

    return NextResponse.json(
      { message: "Monthly price added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding monthly price:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  } finally {
    await closeConnection();
  }
}
