import { addNftToUser, closeConnection } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, address, token, name_collection } = await request.json();

    if (!username || !address || !token) {
      return NextResponse.json(
        { error: "Username, address and token are required" },
        { status: 400 }
      );
    }

    await addNftToUser(username, address, token, name_collection);

    return NextResponse.json(
      { message: "Token added successfully" },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === "Contract is already in user's addresses") {
      return NextResponse.json(
        { message: "Token added successfully" },
        { status: 200 }
      );
    }

    console.error("Error adding address:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  } finally {
    await closeConnection();
  }
}
