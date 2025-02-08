import { removeNftFromUser } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, address, token } = await request.json();

    if (!username || !address || !token) {
      return NextResponse.json(
        { error: "Username, contract and token are required" },
        { status: 400 }
      );
    }

    await removeNftFromUser(username, address, token);

    return NextResponse.json(
      { message: "Token removed successfully" },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === "Contract is already in user's addresses") {
      return NextResponse.json({ message: "" }, { status: 200 });
    }

    console.error("Error removing token:", error);
    return NextResponse.json(
      { error: `Internal Server Error: ${error}` },
      { status: 500 }
    );
  }
}
