import CollectionContract from "@/lib/get-collection-contract";
import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import { useReadContract } from "thirdweb/react";

type Props = {
  address: string;
  [x: string]: unknown;
};

const MetadataCollectionCard: React.FC<Props> = ({ address, ...props }) => {
  const contract = CollectionContract(address);
  if (!contract) notFound();

  const { data: metadata } = useReadContract(getContractMetadata, {
    contract: contract,
    queryOptions: {
      enabled: !!contract,
    },
  });

  console.log(metadata);

  return <div {...props}>{address}</div>;
};

export default MetadataCollectionCard;
