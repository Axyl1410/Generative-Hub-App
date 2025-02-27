import CollectionContract from "@/lib/get-collection-contract";
import { notFound } from "next/navigation";
import { useState } from "react";
import { updateMetadata } from "thirdweb/extensions/erc721";
import { TransactionButton } from "thirdweb/react";
import TransactionDialog, { TransactionStep } from "../ui/transaction-dialog";

type Props = {
  name: string;
  description: string;
  image: File;
  address: string;
  tokenID: string;
};

const UpdateMetadata: React.FC<Props> = ({
  name,
  description,
  image,
  address,
  tokenID,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");

  const contract = CollectionContract(address);

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  if (!contract) notFound();

  return (
    <>
      <TransactionButton
        transaction={() => {
          setIsOpen(true);
          setCurrentStep("sent");

          return updateMetadata({
            contract,
            targetTokenId: BigInt(tokenID),
            newMetadata: {
              name: name,
              description: description,
              image: image,
            },
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
        Update Metadata Nft
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

export default UpdateMetadata;
