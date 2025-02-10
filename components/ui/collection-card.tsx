import client from "@/lib/client";
import CollectionContract from "@/lib/get-collection-contract";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import { MediaRenderer, useReadContract } from "thirdweb/react";

type CollectionCardProps = {
  address: string;
  [x: string]: unknown;
};

const CollectionCard: React.FC<CollectionCardProps> = ({
  address,
  ...props
}) => {
  const contract = CollectionContract(address);
  if (!contract) notFound();

  const { data: metadata } = useReadContract(getContractMetadata, {
    contract: contract,
    queryOptions: {
      enabled: !!contract,
    },
  });
  return (
    <Link
      className="flex min-h-[400px] w-full cursor-pointer flex-col justify-stretch overflow-hidden rounded-lg border border-white/10 bg-white/[.04] transition-all hover:scale-105 hover:shadow-lg"
      href={`/sell/${address}`}
      {...props}
    >
      <div className="relative w-full overflow-hidden bg-white/[.04]">
        {metadata?.image ? (
          <MediaRenderer
            src={metadata.image}
            client={client}
            className="aspect-square object-cover object-center"
            style={{ height: "100%", width: "100%" }}
          />
        ) : (
          <div className="grid h-[300px] w-full place-items-center bg-gray-200">
            <Image src={"/default-image.jpg"} alt="" height={300} width={300} />
          </div>
        )}
      </div>
      <div className="flex w-full flex-1 items-center justify-between bg-gray-200 px-3 shadow dark:bg-neutral-800">
        <div className="flex flex-col justify-center py-3">
          <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg text-black dark:text-white">
            {metadata?.name}
          </p>
          <p className="text-sm font-semibold text-text dark:text-white/80">
            Symbol: {metadata?.symbol || "N/A"}
          </p>
          {/* <p className={"mt-2 line-clamp-2 truncate text-sm"}>
            {text}
          </p> */}
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;
