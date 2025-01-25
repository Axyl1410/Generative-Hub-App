"use client";

import { MARKETPLACE } from "@/contracts";
import { useEffect, useState } from "react";
import {
  getAllValidAuctions,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";

export default function CheckNFTListing({
  contractAddress,
  tokenId,
}: {
  contractAddress: string;
  tokenId: string;
}) {
  const [isListed, setIsListed] = useState(false);
  const [isAuctioned, setIsAuctioned] = useState(false);

  // Using useReadContract to fetch all valid listings
  const { data: listings } = useReadContract(getAllValidListings, {
    contract: MARKETPLACE,
  });

  // Using useReadContract to fetch all valid auctions
  const { data: auctions } = useReadContract(getAllValidAuctions, {
    contract: MARKETPLACE,
  });

  useEffect(() => {
    if (listings) {
      // Check if the NFT is listed
      const listing = listings.find(
        (l) =>
          l.assetContractAddress === contractAddress &&
          l.tokenId === BigInt(tokenId)
      );
      setIsListed(!!listing);
    }
  }, [listings, contractAddress, tokenId]);

  useEffect(() => {
    if (auctions) {
      // Check if the NFT is auctioned
      const auction = auctions.find(
        (a) =>
          a.assetContractAddress === contractAddress &&
          a.tokenId === BigInt(tokenId)
      );
      setIsAuctioned(!!auction);
    }
  }, [auctions, contractAddress, tokenId]);

  return isListed || isAuctioned;
}
