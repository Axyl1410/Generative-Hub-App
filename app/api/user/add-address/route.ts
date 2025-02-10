import { addAddressToUser, closeConnection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, address } = await request.json();

    if (!username || !address) {
      return NextResponse.json(
        { error: "Username and address are required" },
        { status: 400 }
      );
    }

    await addAddressToUser(username, address);

    return NextResponse.json(
      { message: "Address added successfully" },
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
