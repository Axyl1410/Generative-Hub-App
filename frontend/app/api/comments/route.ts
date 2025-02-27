import { addComment, closeConnection, getComments } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const nft_contract = searchParams.get("nft_contract");
    const token_Id = searchParams.get("token_Id");

    if (!nft_contract || !token_Id) {
      return NextResponse.json(
        { error: "NFT contract and token ID are required" },
        { status: 400 }
      );
    }

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
    const { nft_contract, token_Id, content, user_wallet } =
      await request.json();

    if (!nft_contract || !token_Id || !content || !user_wallet) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

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
