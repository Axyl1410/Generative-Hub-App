import CollectionContract from "@/lib/get-collection-contract";
import { notFound } from "next/navigation";
import React, { useState } from "react";
import { burn } from "thirdweb/extensions/erc721";
import { TransactionButton } from "thirdweb/react";
import TransactionDialog, { TransactionStep } from "../ui/transaction-dialog";

interface BurnButtonProps {
  tokenId: bigint; // ID of the NFT to burn
  address: string;
}

const BurnButton: React.FC<BurnButtonProps> = ({ tokenId, address }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");

  const contract = CollectionContract(address);

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  if (!contract) notFound();

  //todo - check is owner for disable button

  return (
    <>
      <TransactionButton
        transaction={() => {
          setIsOpen(true);
          setCurrentStep("sent");

          return burn({
            contract: contract,
            tokenId: tokenId,
          });
        }}
        onError={(error) => {
          setCurrentStep("error");
          setMessage("Transaction failed: " + error.message);
        }}
        onTransactionSent={() => {
          setCurrentStep("confirmed");
        }}
        onTransactionConfirmed={() => {
          setCurrentStep("success");
          setMessage("Transaction is being confirmed...");
        }}
      >
        Burn NFT
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

export default BurnButton;
