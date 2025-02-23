import { readFile } from "fs/promises";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { join } from "path";

// Define the segment params type

// Update the GET handler with the correct type annotation
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<NextResponse> {
  const { path } = await params;
  try {
    const filePath = join(process.cwd(), "uploads", ...path);
    const fileContent = await readFile(filePath);

    const contentType = filePath.endsWith(".html")
      ? "text/html"
      : filePath.endsWith(".css")
        ? "text/css"
        : filePath.endsWith(".js")
          ? "application/javascript"
          : "application/octet-stream";

    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.log("File not found:", error);
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
