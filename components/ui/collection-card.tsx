import CollectionContract from "@/lib/get-collection-contract";
import Link from "next/link";
import { useEffect } from "react";
import { getContractMetadata } from "thirdweb/extensions/common";
import { useReadContract } from "thirdweb/react";

type CollectionCardProps = {
  address: string;
  [x: string]: unknown;
};

const CollectionCard: React.FC<CollectionCardProps> = ({
  address,
  ...props
}) => {
  const contract = CollectionContract(address);

  const { data: metadata } = useReadContract(getContractMetadata, {
    contract: contract,
    queryOptions: {
      enabled: !!contract,
    },
  });

  useEffect(() => {
    console.log(metadata);
  }, [metadata]);

  return (
    <Link
      className="cursor-pointer overflow-hidden rounded-lg border p-4"
      href={`/sell/${address}`}
      {...props}
    >
      <p>{address}</p>
    </Link>
  );
};

export default CollectionCard;
