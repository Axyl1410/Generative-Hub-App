import JSZip from "jszip";

export const extractTraitsFromSketch = async (zipData: Buffer) => {
  const zip = await JSZip.loadAsync(zipData);

  const sketchFile = await zip.file("sketch.js")?.async("string");
  if (!sketchFile) {
    throw new Error("Missing sketch.js file");
  }

  const traitsMatch = sketchFile.match(/const traits = (\{.*?\});/s);
  if (!traitsMatch) {
    throw new Error("No traits found in sketch.js");
  }

  const traits = JSON.parse(traitsMatch[1]);
  return traits;
};

export const validateContractParameters = (params: any) => {
  const required = [
    'name',
    'symbol',
    'artist',
    'mintPrice',
    'maxSupply',
    'royaltyFeeBp',
    'royaltyReceiver',
    'generativeScriptURI'
  ];

  for (const param of required) {
    if (!params[param]) {
      throw new Error(`Missing required parameter: ${param}`);
    }
  }

  if (params.mintPrice <= 0) {
    throw new Error('Mint price must be greater than 0');
  }

  if (params.maxSupply <= 0) {
    throw new Error('Max supply must be greater than 0');
  }

  if (params.royaltyFeeBp < 0 || params.royaltyFeeBp > 10000) {
    throw new Error('Royalty fee must be between 0 and 10000 basis points');
  }
};