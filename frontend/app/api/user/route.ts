import {
  addAddressToUser,
  closeConnection,
  getCollectionbyusername,
} from "@/lib/mongodb";
import { NextResponse } from "next/server";

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
    const { username, address, name } = await request.json();

    if (!username || !address) {
      return NextResponse.json(
        { error: "Username and address are required" },
        { status: 400 }
      );
    }

    // Create address data object matching AddressData interface
    const addressData = {
      address,
      ...(name && { name }), // Only include name if it exists
    };

    await addAddressToUser(username, addressData);

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
