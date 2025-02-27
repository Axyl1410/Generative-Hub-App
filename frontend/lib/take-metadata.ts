import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import CollectionContract from "./get-collection-contract";

const TakeMetadata = (address: string) => {
  const contract = CollectionContract(address);
  if (!contract) notFound();

  const metadata = getContractMetadata({
    contract: contract,
  });

  return { metadata };
};

export default TakeMetadata;
