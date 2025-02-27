"use client";

import { MARKETPLACE } from "@/contracts";
import { useState } from "react";
import {
  bidInAuction,
  DirectListing,
  EnglishAuction,
  makeOffer,
} from "thirdweb/extensions/marketplace";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { Input } from "../ui/input";
import TransactionDialog, { TransactionStep } from "../ui/transaction-dialog";

export default function MakeOfferButton({
  auctionListing,
  directListing,
}: {
  auctionListing?: EnglishAuction;
  directListing?: DirectListing;
}) {
  const account = useActiveAccount();
  const [bid, setBid] = useState("0");
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  return (
    <div className="flex flex-col">
      <Input
        type="number"
        step={0.000001}
        value={bid}
        min={0}
        onChange={(e) => setBid(e.target.value)}
        className="mb-4"
      />
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
          setCurrentStep("confirmed");
        }}
        onError={(error) => {
          setCurrentStep("error");
          setMessage(error.message);
        }}
        onTransactionConfirmed={() => {
          setCurrentStep("success");
        }}
      >
        Make Offer
      </TransactionButton>
      <TransactionDialog
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        currentStep={currentStep}
        title="Transaction Status"
        message={message}
      />
    </div>
  );
}
