import {
  addAddressToUser,
  closeConnection,
  getCollectionbyusername,
} from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  username: z.string().nonempty(),
  address: z.string().nonempty(),
  name: z.string().optional(),
});

const getSchema = z.object({
  username: z.string().nonempty(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = getSchema.safeParse({
      username: searchParams.get("username") || "",
    });

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

    const { username } = result.data;

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

    const { username, address, name } = result.data;

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
