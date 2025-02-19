import { ThirdwebStorage } from "@thirdweb-dev/storage";

const storage = new ThirdwebStorage();

export const uploadToStorage = async (file: File) => {
  try {
    const uri = await storage.upload(file);
    return uri;
  } catch (error) {
    console.error("Error uploading to storage:", error);
    throw error;
  }
};

export const getFromStorage = async (uri: string) => {
  try {
    const data = await storage.download(uri);
    return data;
  } catch (error) {
    console.error("Error getting from storage:", error);
    throw error;
  }
};