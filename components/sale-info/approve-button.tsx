import { MARKETPLACE } from "@/contracts";
import { toast } from "sonner";
import { ThirdwebContract } from "thirdweb";
import { setApprovalForAll } from "thirdweb/extensions/erc721";
import { TransactionButton } from "thirdweb/react";

type Props = {
  contract: ThirdwebContract;
};

export default function ApprovalButton({ contract }: Props) {
  return (
    <TransactionButton
      transaction={() => {
        return setApprovalForAll({
          contract: contract,
          operator: MARKETPLACE.address,
          approved: true,
        });
      }}
      onTransactionSent={() => {
        toast.info("Approving...");
      }}
      onError={(error) => {
        toast.error(`Approval Failed!`, { description: error.message });
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
