"use client";

import EmptyText from "@/components/common/empty-text";
import client from "@/lib/client";
import CollectionContract from "@/lib/get-collection-contract";
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

  return (
    <div className="mt-4 flex w-full gap-4 rounded-lg border border-gray-500/50 bg-white/[.04] p-4">
      <div className="h-32 w-32 rounded-lg">
        {metadata?.image ? (
          <MediaRenderer
            src={metadata.image}
            client={client}
            className="aspect-square object-cover object-center"
            style={{ height: "100%", width: "100%" }}
          />
        ) : (
          <div className="h-10 w-10 rounded-sm bg-gray-200"></div>
        )}
      </div>
      <div className="flex flex-col justify-center py-3">
        <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg text-black dark:text-white">
          {metadata?.name}
        </p>
        <p className="text-sm font-semibold text-text dark:text-white/80">
          Symbol: {metadata?.symbol || "N/A"}
        </p>
        <p className={"mt-2 line-clamp-2 truncate text-sm"}>
          {metadata?.description}
        </p>
      </div>
    </div>
  );
}

export function MetadataLoading() {
  return (
    <div className="mt-4 h-[146px] w-full animate-pulse rounded-lg bg-gray-300" />
  );
}
