"use client";

import BackButton from "@/components/common/back-button";
import ListingGrid from "@/components/nft/listing-grid";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import { MARKETPLACE, NFT_COLLECTION } from "@/contracts";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Buy() {
  return (
    <div className="mt-10">
      <div className={"flex w-full items-center justify-between"}>
        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl">
          Buy NFTs
        </h1>
        <BackButton className={"h-fit"} />
      </div>

      <div className="my-8">
        <Suspense fallback={<NFTGridLoading />}>
          <ListingGrid
            marketplace={MARKETPLACE}
            collection={NFT_COLLECTION}
            emptyText={
              "Looks like there are no listed NFTs in this collection. Check back later!"
            }
          />
        </Suspense>
      </div>
    </div>
  );
}
