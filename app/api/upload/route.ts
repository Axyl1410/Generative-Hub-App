import extract from "extract-zip";
import { existsSync, readdirSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Create a unique folder for this upload
    const uniqueId = uuidv4();
    const userFolder = path.join(uploadDir, uniqueId);
    await mkdir(userFolder, { recursive: true });

    // Save the uploaded file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const tempFilePath = path.join(userFolder, `${Date.now()}-${file.name}`);
    await writeFile(tempFilePath, buffer);

    try {
      // Extract the zip file
      await extract(tempFilePath, { dir: userFolder });

      // Check for index.html
      const files = readdirSync(userFolder);
      const indexFile = files.find(
        (file) => file.toLowerCase() === "index.html"
      );

      if (!indexFile) {
        return NextResponse.json(
          { message: "index.html không tồn tại trong file ZIP" },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          message: "File uploaded and extracted successfully",
          folderId: uniqueId,
          url: `/api/static/${uniqueId}/index.html`,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Extraction error:", error);
      return NextResponse.json(
        {
          message: "Lỗi khi giải nén file",
          error: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        message: "Lỗi khi xử lý file",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
