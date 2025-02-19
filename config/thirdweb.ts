import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { FormaSketchpad } from "@thirdweb-dev/chains";

export const sdk = new ThirdwebSDK(FormaSketchpad , {
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
});

export const getContract = async (contractAddress: string) => {
  try {
    return await sdk.getContract(contractAddress);
  } catch (error) {
    console.error("Error getting contract:", error);
    throw error;
  }
};