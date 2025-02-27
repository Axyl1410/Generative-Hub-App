import { MARKETPLACE } from "@/contracts";
import React, { useState } from "react";
import { cancelAuction, cancelListing } from "thirdweb/extensions/marketplace";
import { TransactionButton } from "thirdweb/react";
import TransactionDialog, { TransactionStep } from "../ui/transaction-dialog";

interface CancelButtonProps {
  id?: bigint;
  type: "listing" | "auction";
}

const CancelButton: React.FC<CancelButtonProps> = ({ id, type }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");

  if (id === undefined) return null;

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  return (
    <>
      <TransactionButton
        transaction={() => {
          setIsOpen(true);
          setCurrentStep("sent");
          if (type === "listing") {
            return cancelListing({
              contract: MARKETPLACE,
              listingId: id,
            });
          }
          return cancelAuction({
            contract: MARKETPLACE,
            auctionId: id,
          });
        }}
        onTransactionSent={() => {
          setCurrentStep("confirmed");
        }}
        onError={(error) => {
          setCurrentStep("error");
          setMessage(error.message);
        }}
        onTransactionConfirmed={(txResult) => {
          setCurrentStep("success");
          console.log(txResult);
        }}
      >
        Cancel Listing or Auction
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
};

export default CancelButton;
