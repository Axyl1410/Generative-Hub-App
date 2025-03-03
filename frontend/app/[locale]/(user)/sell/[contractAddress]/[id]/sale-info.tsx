"use client";

import SaleInfo from "@/components/sale-info";
import { NFT as NFTType } from "thirdweb";

export function Saleinfo({ address, nft }: { address: string; nft: NFTType }) {
  return <SaleInfo address={address} nft={nft} />;
}
