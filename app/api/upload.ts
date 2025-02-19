import { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import fs from "fs";
import JSZip from "jszip";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { extractTraitsFromSketch } from "../../utils/helpers";

const storage = new ThirdwebStorage();

export const config = {
  api: {
    bodyParser: false,
  },
};

const parseForm = (req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const form = new formidable.IncomingForm();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

const checkFileStructure = async (zipData: Buffer) => {
  const zip = await JSZip.loadAsync(zipData);

  const requiredFiles = [
    "index.html", 
    "sketch.js", 
    "fonts/IBM.ttf", 
    "lib/hl-gen.js", 
    "lib/p5.min.js"
  ];
  
  const zipFiles = Object.keys(zip.files);

  for (const file of requiredFiles) {
    if (!zipFiles.includes(file)) {
      throw new Error(`Missing required file: ${file}`);
    }
  }

  const traits = await extractTraitsFromSketch(zipData);
  return traits;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { files } = await parseForm(req);
    const zipFile = files.file as formidable.File;

    if (!zipFile) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const zipData = fs.readFileSync(zipFile.filepath);
    const traits = await checkFileStructure(zipData);

    // Upload to IPFS via ThirdWeb Storage
    const uri = await storage.upload({ 
      name: zipFile.originalFilename || "generative-script.zip", 
      data: zipData 
    });

    // Clean up temporary file
    fs.unlinkSync(zipFile.filepath);

    res.status(200).json({ 
      message: "File uploaded successfully.", 
      traits, 
      uri 
    });
  } catch (error) {
    console.error("Error processing upload:", error);
    res.status(500).json({ 
      error: 'Error processing file upload.', 
      message: error.message 
    });
  }
};