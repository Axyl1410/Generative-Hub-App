import { MARKETPLACE, NFT_COLLECTION } from "@/contracts";
import { toast } from "sonner";
import { setApprovalForAll } from "thirdweb/extensions/erc721";
import { TransactionButton } from "thirdweb/react";

export default function ApprovalButton() {
  return (
    <TransactionButton
      transaction={() => {
        return setApprovalForAll({
          contract: NFT_COLLECTION,
          operator: MARKETPLACE.address,
          approved: true,
        });
      }}
      onTransactionSent={() => {
        toast.info("Approving...");
      }}
      onError={(error) => {
        toast.error(`Approval Failed!`);
        console.error(error);
      }}
      onTransactionConfirmed={(txResult) => {
        toast.success("Approval successful.");
        console.log(txResult);
      }}
    >
      Approve
    </TransactionButton>
  );
}
