import { closeConnection, removeNftFromUser } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  username: z.string().nonempty(),
  address: z.string().nonempty(),
  token: z.string().nonempty(),
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

    const { username, address, token } = result.data;

    await removeNftFromUser(username, address, token);

    return NextResponse.json(
      { message: "Token removed successfully" },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === "Contract is already in user's addresses")
      return NextResponse.next();

    console.error("Error removing token:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  } finally {
    await closeConnection();
  }
}
