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
  // emptyText?: string;
};

export default function NFTGrid({
  nftData,
  overrideOnclickBehavior,
  address,
  // emptyText = "No NFTs found for this collection.",
}: Props) {
  if (nftData && nftData.length > 0) {
    return (
      <>
        {nftData.map((nft) => (
          <NFT
            key={nft.tokenId}
            {...nft}
            address={address}
            overrideOnclickBehavior={overrideOnclickBehavior}
          />
        ))}
      </>
    );
  }

  // return (
  //   <div className="flex h-[500px] justify-center">
  //     <p className="max-w-lg text-center text-lg font-semibold text-black dark:text-white">
  //       {emptyText}
  //     </p>
  //   </div>
  // );
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
