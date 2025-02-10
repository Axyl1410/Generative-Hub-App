"use client";

import EmptyText from "@/components/common/empty-text";
import ReadMore from "@/components/common/read-more-text";
import client from "@/lib/client";
import CollectionContract from "@/lib/get-collection-contract";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getContractMetadata } from "thirdweb/extensions/common";
import { MediaRenderer, useReadContract } from "thirdweb/react";

export function Metadata({ address }: { address: string }) {
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

  if (isLoading) return <MetadataLoading />;
  if (error) return <EmptyText text={`Error: ${error.message}`} />;
  
  // const text = "sahkdjhsakjdhksajhdkjsadkjjsahkdjhsakjdhsakjdhjksahdkjashdkjsahdkjsahdksajhdkjsahdkjsahdksahdkjashdkasjhdkjahdkjashdkjsahdkjsahkdjahsk"
  return (
    <div className="mt-4 flex w-full gap-4 rounded-lg border border-gray-500/50 bg-white/[.04] p-4">
      <div className="h-32 w-32 flex-shrink-0 rounded-lg">
        {metadata?.image ? (
          <MediaRenderer
            src={metadata.image}
            client={client}
            className="aspect-square object-cover object-center"
            style={{ height: "100%", width: "100%" }}
          />
        ) : (
          <div className="grid h-full w-full place-items-center bg-gray-200">
            <Image src={"/default-image.jpg"} alt="" height={300} width={300} />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center py-3">
        <p className="truncate text-lg text-black dark:text-white">
          {metadata?.name}
        </p>
        <p className="text-sm font-semibold text-text dark:text-white/80">
          Symbol: {metadata?.symbol || "N/A"}
        </p>
        <div className="relative mt-2 max-h-32 w-full">
          <ReadMore 
            text={metadata?.description} 
            maxLength={50} 
            className="overflow-y-auto pr-2 text-sm break-words" 
          />
        </div>
      </div>
    </div>
  );
}

export function MetadataLoading() {
  return (
    <div className="mt-4 h-[146px] w-full animate-pulse rounded-lg bg-gray-300" />
  );
}