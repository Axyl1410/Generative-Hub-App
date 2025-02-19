import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: Request) {
  const data = await req.json();
  const userId = uuidv4(); // Generate a unique ID for the user session

  // Define the path to the user-specific sketch.js file
  const sketchPath = path.join(process.cwd(), "public", `sketch-${userId}.js`);

  try {
    // Update the user-specific sketch.js file with the new content
    fs.writeFileSync(sketchPath, data);

    return NextResponse.json(
      { message: "File updated successfully", userId },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating file" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { userId } = await req.json();

  // Define the path to the user-specific sketch.js file
  const sketchPath = path.join(process.cwd(), "public", `sketch-${userId}.js`);

  try {
    // Delete the user-specific sketch.js file
    if (fs.existsSync(sketchPath)) {
      fs.unlinkSync(sketchPath);
    }

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting file" },
      { status: 500 }
    );
  }
}

export const config = {
  api: {
    bodyParser: true,
  },
};
