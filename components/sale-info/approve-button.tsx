import { MARKETPLACE } from "@/contracts";
import CollectionContract from "@/lib/get-collection-contract";
import { toast } from "sonner";
import { setApprovalForAll } from "thirdweb/extensions/erc721";
import { TransactionButton } from "thirdweb/react";

type Props = {
  address: string;
};

export default function ApprovalButton({ address }: Props) {
  const contract = CollectionContract(address);

  if (!contract) return null;

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
