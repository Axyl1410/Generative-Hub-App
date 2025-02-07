import { MARKETPLACE } from "@/contracts";
import React from "react";
import { toast } from "sonner";
import { cancelAuction, cancelListing } from "thirdweb/extensions/marketplace";
import { TransactionButton } from "thirdweb/react";

interface CancelButtonProps {
  id?: bigint;
  type: "listing" | "auction";
}

const CancelButton: React.FC<CancelButtonProps> = ({ id, type }) => {
  if (id === undefined) return null;

  return (
    <TransactionButton
      transaction={() => {
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
        toast.info("Cancelling...");
      }}
      onError={(error) => {
        toast.error(`Cancellation Failed!`, { description: error.message });
      }}
      onTransactionConfirmed={() => {
        toast.success("Cancelled Successfully!");
      }}
    >
      Cancel Listing or Auction
    </TransactionButton>
  );
};

export default CancelButton;
