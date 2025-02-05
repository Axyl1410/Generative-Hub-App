import { addAddressToUser } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, address } = await request.json();

    if (!username || !address) {
      return new NextResponse(
        JSON.stringify({ error: "Username and address are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await addAddressToUser(username, address);

    return new NextResponse(
      JSON.stringify({ message: "Address added successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding address:", error);

    return new NextResponse(
      JSON.stringify({ error: `Internal Server Error: ${error}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
