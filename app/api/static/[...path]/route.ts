import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

interface StaticRouteContext {
  params: {
    path: string[];
  };
}

export async function GET(request: NextRequest, context: StaticRouteContext) {
  try {
    const filePath = join(process.cwd(), "uploads", ...context.params.path);
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
