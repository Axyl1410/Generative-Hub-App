import { MARKETPLACE } from "@/contracts";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { NFT as NFTType } from "thirdweb";
import { createAuction } from "thirdweb/extensions/marketplace";
import { TransactionButton } from "thirdweb/react";
import TransactionDialog, { TransactionStep } from "../ui/transaction-dialog";

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
          return createAuction({
            contract: MARKETPLACE,
            assetContractAddress: address,
            tokenId: nft.id,
            minimumBidAmount,
            buyoutBidAmount,
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
          router.push(`/token/${address}/${nft.id.toString()}`);
        }}
      >
        List for Auction
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
