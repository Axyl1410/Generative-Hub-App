import { addMonthlyPrice, closeConnection } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";

const postSchema = z.object({
  address: z.string().nonempty(),
  tokenId: z.string().nonempty(),
  price: z.number().min(0),
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

    const { address, tokenId, price } = result.data;

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
