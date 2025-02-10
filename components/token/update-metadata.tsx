import CollectionContract from "@/lib/get-collection-contract";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { updateMetadata } from "thirdweb/extensions/erc721";
import { TransactionButton } from "thirdweb/react";

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
  const contract = CollectionContract(address);

  if (!contract) notFound();

  return (
    <TransactionButton
      transaction={() => {
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
        toast.error("Failed to update metadata", {
          description: error instanceof Error ? error.message : undefined,
        });
      }}
      onTransactionSent={() => {
        toast("Metadata updated sent");
      }}
      onTransactionConfirmed={() => {
        toast("Metadata updated confirmed");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }}
    >
      Update Metadata Nft
    </TransactionButton>
  );
};

export default UpdateMetadata;
