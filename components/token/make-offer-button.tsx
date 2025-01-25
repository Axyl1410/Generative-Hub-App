"use client";

import { TransactionButton, useActiveAccount } from "thirdweb/react";
import {
  bidInAuction,
  DirectListing,
  EnglishAuction,
  makeOffer,
} from "thirdweb/extensions/marketplace";
import { MARKETPLACE } from "@/contracts";
import { useState } from "react";
import { toast } from "sonner";

export default function MakeOfferButton({
  auctionListing,
  directListing,
}: {
  auctionListing?: EnglishAuction;
  directListing?: DirectListing;
}) {
  const account = useActiveAccount();
  const [bid, setBid] = useState("0");

  return (
    <div className="flex flex-col">
      <input
        className="box-shadow-md mb-4 block w-full rounded-lg border bg-transparent px-4 py-3 text-base dark:border-white"
        type="number"
        step={0.000001}
        value={bid}
        onChange={(e) => setBid(e.target.value)}
      />
      <TransactionButton
        disabled={
          account?.address === auctionListing?.creatorAddress ||
          account?.address === directListing?.creatorAddress ||
          (!directListing && !auctionListing)
        }
        transaction={() => {
          if (!account) throw new Error("No account");
          if (auctionListing) {
            return bidInAuction({
              contract: MARKETPLACE,
              auctionId: auctionListing.id,
              bidAmount: bid,
            });
          } else if (directListing) {
            return makeOffer({
              contract: MARKETPLACE,
              assetContractAddress: directListing.assetContractAddress,
              tokenId: directListing.tokenId,
              currencyContractAddress: directListing.currencyContractAddress,
              totalOffer: bid,
              offerExpiresAt: new Date(
                Date.now() + 10 * 365 * 24 * 60 * 60 * 1000
              ),
            });
          } else {
            throw new Error("No valid listing found for this NFT");
          }
        }}
        onTransactionSent={() => {
          toast.info("Offer Sent!");
        }}
        onError={(error) => {
          toast.error("Error making offer: " + error.message);
        }}
        onTransactionConfirmed={() => {
          toast.success("Offer Placed Successfully!");
        }}
      >
        Make Offer
      </TransactionButton>
    </div>
  );
}
