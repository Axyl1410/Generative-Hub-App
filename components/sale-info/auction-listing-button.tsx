"use client";

import { MARKETPLACE } from "@/contracts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NFT as NFTType } from "thirdweb";
import { createAuction } from "thirdweb/extensions/marketplace";
import { TransactionButton } from "thirdweb/react";

export default function AuctionListingButton({
  nft,
  minimumBidAmount,
  buyoutBidAmount,
  address,
}: {
  nft: NFTType;
  minimumBidAmount: string;
  buyoutBidAmount: string;
  address: string;
}) {
  const router = useRouter();

  return (
    <TransactionButton
      transaction={() => {
        return createAuction({
          contract: MARKETPLACE,
          assetContractAddress: address,
          tokenId: nft.id,
          minimumBidAmount,
          buyoutBidAmount,
        });
      }}
      onTransactionSent={() => {
        toast.info("Listing...");
      }}
      onError={(error) => {
        toast.error(`Listing Failed!`, { description: error.message });
      }}
      onTransactionConfirmed={(txResult) => {
        toast.success("Listed Successfully!");
        console.log(txResult);
        router.push(`/token/${address}/${nft.id.toString()}`);
      }}
    >
      List for Auction
    </TransactionButton>
  );
}
