import { addAddressToUser } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, address } = await request.json();

    if (!username || !address) {
      return new NextResponse(
        JSON.stringify({ error: "Username and address are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await addAddressToUser(username, address);

    return new NextResponse(
      JSON.stringify({ message: "Address added successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error adding address:", error);

    return new NextResponse(
      JSON.stringify({ error: `Internal Server Error: ${error}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const OPTIONS = async (request: Request) => {
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",")
    : ["http://localhost:3000"];
  const origin = request.headers.get("origin") || "*";

  if (allowedOrigins.includes(origin) || origin === "*") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS", // Include OPTIONS
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } else {
    return new NextResponse(null, {
      status: 403,
    });
  }
};
