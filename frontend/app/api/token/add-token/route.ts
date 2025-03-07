import { addNftToUser, closeConnection } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  username: z.string().nonempty(),
  address: z.string().nonempty(),
  token: z.string().nonempty(),
  name_collection: z.string().nonempty(),
});

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

    const { username, address, token, name_collection } = result.data;

    await addNftToUser(username, address, token, name_collection);

    return NextResponse.json(
      { message: "Token added successfully" },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === "Contract is already in user's addresses")
      return NextResponse.next();

    console.error("Error adding address:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  } finally {
    await closeConnection();
  }
}
