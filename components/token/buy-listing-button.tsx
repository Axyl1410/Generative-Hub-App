"use client";

import Loading from "@/app/loading";
import { MARKETPLACE } from "@/contracts";
import axios from "@/lib/axios-config";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  buyFromListing,
  buyoutAuction,
  DirectListing,
  EnglishAuction,
} from "thirdweb/extensions/marketplace";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import TransactionDialog, { TransactionStep } from "../ui/transaction-dialog";

type Props = {
  auctionListing?: EnglishAuction;
  directListing?: DirectListing;
  contractAddress: string;
  tokenId: string;
};

export default function BuyListingButton({
  auctionListing,
  directListing,
  contractAddress,
  tokenId,
}: Props) {
  const account = useActiveAccount();
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!account) Loading();

  const handle = async () => {
    try {
      await Promise.all([
        axios.post("/api/token/add-token", {
          username: account?.address,
          address: contractAddress,
          token: tokenId,
        }),
        axios.post("/api/token/remove-token", {
          username:
            account?.address === auctionListing?.creatorAddress ||
            account?.address === directListing?.creatorAddress,
          address: contractAddress,
          token: tokenId,
        }),
      ])
        .then(() => toast("Collection created successfully"))
        .catch((error) =>
          toast.error("Failed to create collection", {
            description: error instanceof Error ? error.message : undefined,
          })
        );
    } catch (error) {
      toast.error("Failed to create collection", {
        description: error instanceof Error ? error.message : undefined,
      });
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <>
      <TransactionButton
        disabled={
          account?.address === auctionListing?.creatorAddress ||
          account?.address === directListing?.creatorAddress ||
          (!directListing && !auctionListing)
        }
        transaction={() => {
          setIsOpen(true);
          setCurrentStep("sent");
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
          setCurrentStep("confirmed");
        }}
        onError={(error) => {
          setCurrentStep("error");
          setMessage(error.message);
        }}
        onTransactionConfirmed={() => {
          handle();
          setCurrentStep("success");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }}
      >
        Buy Now
      </TransactionButton>
      <TransactionDialog
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        currentStep={currentStep}
        title="Transaction Status"
        message={message}
      />
    </>
  );
}
