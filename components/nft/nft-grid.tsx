"use client";

import type { NFT as NFTType } from "thirdweb";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";
import NFT, { LoadingNFTComponent } from "./nft";

type Props = {
  nftData: {
    tokenId: bigint;
    nft?: NFTType;
    directListing?: DirectListing;
    auctionListing?: EnglishAuction;
  }[];
  overrideOnclickBehavior?: (nft: NFTType) => void;
  address: string;
};

export default function NFTGrid({ nftData, address }: Props) {
  if (nftData && nftData.length > 0) {
    return (
      <>
        {nftData.map((nft) => (
          <NFT key={nft.tokenId} {...nft} address={address} />
        ))}
      </>
    );
  }
}

export function NFTGridLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {[...Array(12)].map((_, index) => (
        <LoadingNFTComponent key={index} />
      ))}
    </div>
  );
}
