import { addComment, closeConnection, getComments } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import { z } from "zod";

const getSchema = z.object({
  nft_contract: z.string().nonempty(),
  token_Id: z.string().nonempty(),
});

const postSchema = z.object({
  nft_contract: z.string().nonempty(),
  token_Id: z.string().nonempty(),
  content: z.string().nonempty(),
  user_wallet: z.string().nonempty(),
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const result = getSchema.safeParse({
      nft_contract: searchParams.get("nft_contract") || "",
      token_Id: searchParams.get("token_Id") || "",
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

    const { nft_contract, token_Id } = result.data;

    const comments = await getComments(nft_contract, token_Id);
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
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
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { nft_contract, token_Id, content, user_wallet } = body;

    await addComment(nft_contract, token_Id, {
      content,
      user_wallet,
    });

    return NextResponse.json(
      { message: "Comment added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding comment:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  } finally {
    await closeConnection();
  }
}
