import { addAddressToUser, closeConnection } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { getCollectionbyusername } from "@/lib/mongodb";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const user = await getCollectionbyusername(username);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
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
