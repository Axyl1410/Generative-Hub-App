"use client";

import { MARKETPLACE } from "@/contracts";
import { useEffect, useMemo, useState } from "react";
import {
  getAllValidAuctions,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";
import { useReadContract } from "thirdweb/react";

interface NFTListingStatus {
  isSell: boolean;
  listed: boolean;
  auctioned: boolean;
  listingId?: bigint;
}

interface CheckNFTListingProps {
  contractAddress: string;
  tokenId: string;
}

export default function CheckNFTListing({
  contractAddress,
  tokenId,
}: CheckNFTListingProps): NFTListingStatus {
  const [status, setStatus] = useState<NFTListingStatus>({
    isSell: false,
    listed: false,
    auctioned: false,
    listingId: undefined,
  });

  const { data: listings, isLoading: isListingsLoading } = useReadContract(
    getAllValidListings,
    { contract: MARKETPLACE }
  );

  const { data: auctions, isLoading: isAuctionsLoading } = useReadContract(
    getAllValidAuctions,
    { contract: MARKETPLACE }
  );

  const tokenIdBigInt = useMemo(() => BigInt(tokenId), [tokenId]);

  const activeListing = useMemo(() => {
    if (!listings || isListingsLoading) return undefined;

    return listings.find(
      (l) =>
        l.assetContractAddress === contractAddress &&
        l.tokenId === tokenIdBigInt &&
        l.status === "ACTIVE"
    );
  }, [listings, contractAddress, tokenIdBigInt, isListingsLoading]);

  const activeAuction = useMemo(() => {
    if (!auctions || isAuctionsLoading) return undefined;

    return auctions.find(
      (a) =>
        a.assetContractAddress === contractAddress &&
        a.tokenId === tokenIdBigInt &&
        a.status === "ACTIVE"
    );
  }, [auctions, contractAddress, tokenIdBigInt, isAuctionsLoading]);

  const currentStatus = useMemo<NFTListingStatus>(
    () => ({
      listed: !!activeListing,
      auctioned: !!activeAuction,
      isSell: !!(activeListing || activeAuction),
      listingId: activeListing?.id || activeAuction?.id,
    }),
    [activeListing, activeAuction]
  );

  useEffect(() => {
    setStatus(currentStatus);
  }, [currentStatus]);

  return status;
}
