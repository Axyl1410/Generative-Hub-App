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

export interface ArtParameters {
  complexity: number;
  colorScheme: "random" | "monochrome" | "complementary";
  size: number;
}

export interface GeneratedArtwork {
  id: string;
  imageUrl: string;
  parameters: ArtParameters;
  createdAt: Date;
  creator: string;
}

export type Attribute = {
  trait_type: string;
  value: string;
};
