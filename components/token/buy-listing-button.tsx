"use client";

import { MARKETPLACE } from "@/contracts";
import axios from "@/lib/axios-config";
import { useRouter } from "next/router";
import { toast } from "sonner";
import {
  buyFromListing,
  buyoutAuction,
  DirectListing,
  EnglishAuction,
} from "thirdweb/extensions/marketplace";
import { TransactionButton, useActiveAccount } from "thirdweb/react";

export default function BuyListingButton({
  auctionListing,
  directListing,
  contractAddress,
  tokenId,
  owner,
}: {
  auctionListing?: EnglishAuction;
  directListing?: DirectListing;
  contractAddress: string;
  tokenId: string;
  owner: string;
}) {
  const router = useRouter();
  const account = useActiveAccount();

  const handle = async () => {
    try {
      await Promise.all([
        axios.post("/api/token/add-token", {
          username: account?.address,
          address: contractAddress,
          token: tokenId,
        }),
        axios.post("/api/token/remove-token", {
          username: owner,
          address: contractAddress,
          token: tokenId,
        }),
      ]);

      toast("Collection created successfully");
    } catch (error) {
      toast.error("Failed to create collection", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  return (
    <TransactionButton
      disabled={
        account?.address === auctionListing?.creatorAddress ||
        account?.address === directListing?.creatorAddress ||
        (!directListing && !auctionListing)
      }
      transaction={() => {
        if (!account) throw new Error("No account");
        if (auctionListing) {
          return buyoutAuction({
            contract: MARKETPLACE,
            auctionId: auctionListing.id,
          });
        } else if (directListing) {
          return buyFromListing({
            contract: MARKETPLACE,
            listingId: directListing.id,
            recipient: account.address,
            quantity: BigInt(1),
          });
        } else {
          throw new Error("No valid listing found for this NFT");
        }
      }}
      onTransactionSent={() => {
        toast.info("Purchasing...");
      }}
      onError={(error) => {
        toast.error("Purchase Failed!" + error.message);
      }}
      onTransactionConfirmed={() => {
        handle();
        toast.success("Purchase Successful!");
        router.push("/sell");
      }}
    >
      Buy Now
    </TransactionButton>
  );
}
