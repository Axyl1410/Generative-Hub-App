"use client";

import NFTGrid from "@/components/nft/nft-grid";
import { MARKETPLACE } from "@/contracts";
import React, { useEffect, useState } from "react";
import { NFT as NFTType, ThirdwebContract } from "thirdweb";
import {
  DirectListing,
  EnglishAuction,
  getAllValidAuctions,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";
import { LoadingNFTComponent } from "./nft";

type Props = {
  marketplace: ThirdwebContract;
  collection: string;
  overrideOnclickBehavior?: (nft: NFTType) => void;
};

interface NFTData {
  tokenId: bigint;
  nft?: NFTType;
  directListing?: DirectListing;
  auctionListing?: EnglishAuction;
}

const ListingGrid: React.FC<Props> = (props) => {
  const [nftData, setNftData] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = React.useCallback(async () => {
    const listingsPromise = getAllValidListings({
      contract: MARKETPLACE,
    });
    const auctionsPromise = getAllValidAuctions({
      contract: MARKETPLACE,
    });

    const [listings, auctions] = await Promise.all([
      listingsPromise,
      auctionsPromise,
    ]);

    // Retrieve all NFTs from the listings
    const tokenIds = Array.from(
      new Set([
        ...listings
          .filter((l) => l.assetContractAddress === props.collection)
          .map((l) => l.tokenId),
        ...auctions
          .filter((a) => a.assetContractAddress === props.collection)
          .map((a) => a.tokenId),
      ])
    );

    const nftData = tokenIds.map((tokenId) => {
      return {
        tokenId: tokenId,
        directListing: listings.find((listing) => listing.tokenId === tokenId),
        auctionListing: auctions.find((listing) => listing.tokenId === tokenId),
      };
    });

    setNftData(nftData);
    setLoading(false);
  }, [props.collection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return loading ? (
    <LoadingNFTComponent />
  ) : (
    <NFTGrid
      nftData={nftData}
      // emptyText={props.emptyText}
      address={props.collection}
      overrideOnclickBehavior={props.overrideOnclickBehavior}
    />
  );
};

export default ListingGrid;
