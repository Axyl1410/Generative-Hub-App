"use client";

import { MARKETPLACE } from "@/contracts";
import { useEffect, useState } from "react";
import { useReadContract } from "thirdweb/react";
import { getAuction, getListing } from "thirdweb/extensions/marketplace";

export default function CheckNFTListing({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) {
  const [isListed, setIsListed] = useState<boolean>(false);
  const [isAuctioned, setIsAuctioned] = useState<boolean>(false);

  // Using useReadContract to fetch listing for a specific NFT
  const { data: listing } = useReadContract(getListing, {
    contract: MARKETPLACE,
    listingId: BigInt(tokenId),
  });

  // Using useReadContract to fetch auction for a specific NFT
  const { data: auction } = useReadContract(getAuction, {
    contract: MARKETPLACE,
    auctionId: BigInt(tokenId),
  });

  useEffect(() => {
    if (listing) {
      // Check if the NFT is listed
      setIsListed(
        listing.assetContractAddress === contractAddress &&
          listing.status === "ACTIVE"
      );
    }
  }, [listing, contractAddress]);

  useEffect(() => {
    if (auction) {
      // Check if the NFT is auctioned
      setIsAuctioned(
        auction.assetContractAddress === contractAddress &&
          auction.status === "ACTIVE"
      );
    }
  }, [auction, contractAddress]);

  return { isSell: isListed || isAuctioned, isListed, isAuctioned };
}
