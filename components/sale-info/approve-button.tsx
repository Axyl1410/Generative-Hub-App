import { MARKETPLACE } from "@/contracts";
import { useState } from "react";
import { ThirdwebContract } from "thirdweb";
import { setApprovalForAll } from "thirdweb/extensions/erc721";
import { TransactionButton } from "thirdweb/react";
import TransactionDialog, { TransactionStep } from "../ui/transaction-dialog";

type Props = {
  contract: ThirdwebContract;
};

export default function ApprovalButton({ contract }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  return (
    <>
      <TransactionButton
        transaction={() => {
          setIsOpen(true);
          setCurrentStep("sent");
          return setApprovalForAll({
            contract: contract,
            operator: MARKETPLACE.address,
            approved: true,
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
        Approve
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
