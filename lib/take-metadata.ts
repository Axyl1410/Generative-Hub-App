import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import { useReadContract } from "thirdweb/react";
import CollectionContract from "./get-collection-contract";

const TakeMetadate = (address: string) => {
  const contract = CollectionContract(address);
  if (!contract) notFound();

  const {
    data: metadata,
    isLoading,
    error,
  } = useReadContract(getContractMetadata, {
    contract: contract,
    queryOptions: {
      enabled: !!contract,
    },
  });

  return { metadata, isLoading, error };
};

export default TakeMetadate;
