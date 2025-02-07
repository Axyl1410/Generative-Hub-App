"use client";

import { MARKETPLACE } from "@/contracts";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { NFT as NFTType } from "thirdweb";
import { createListing } from "thirdweb/extensions/marketplace";
import { TransactionButton } from "thirdweb/react";

export default function DirectListingButton({
  nft,
  pricePerToken,
  address,
}: {
  nft: NFTType;
  pricePerToken: string;
  address: string;
}) {
  const router = useRouter();
  return (
    <TransactionButton
      transaction={() => {
        return createListing({
          contract: MARKETPLACE,
          assetContractAddress: address,
          tokenId: nft.id,
          pricePerToken,
        });
      }}
      onTransactionSent={() => {
        toast.info("Listing...");
      }}
      onError={(error) => {
        toast.error(`Listing Failed!` + error);
      }}
      onTransactionConfirmed={(txResult) => {
        toast.success("Listed Successfully!");
        console.log(txResult);
        router.push(`/token/${address}/${nft.id.toString()}`);
      }}
    >
      List for Sale
    </TransactionButton>
  );
}
