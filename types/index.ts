export type ThirdwebButtonProps = {
  type?: "icon" | "text";
  className?: string;
  [key: string]: unknown;
};

export type NFT = {
  contract: string;
  tokenId: string;
};

export interface User {
  username: string;
  address: string[];
  nft: NFT[];
}
