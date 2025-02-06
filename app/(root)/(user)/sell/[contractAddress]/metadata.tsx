"use client";

import client from "@/lib/client";
import CollectionContract from "@/lib/get-collection-contract";
import { getContractMetadata } from "thirdweb/extensions/common";
import { MediaRenderer, useReadContract } from "thirdweb/react";

export function Metadata({ address }: { address: string }) {
  const contract = CollectionContract(address);

  const { data: metadata } = useReadContract(getContractMetadata, {
    contract: contract,
    queryOptions: {
      enabled: !!contract,
    },
  });

  return (
    <div className="mt-4 flex w-full gap-4 rounded-sm border border-gray-500/50 bg-white/[.04] p-4">
      <div className="h-32 w-32 rounded-sm">
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
