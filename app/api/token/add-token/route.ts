import { addNftToUser } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, address, token } = await request.json();

    if (!username || !address || !token) {
      return NextResponse.json(
        { error: "Username, address and token are required" },
        { status: 400 }
      );
    }

    await addNftToUser(username, address, token);

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
