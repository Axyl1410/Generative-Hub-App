"use client";

import EmptyText from "@/components/common/empty-text";
import Loading from "@/components/common/loading";
import SaleInfo from "@/components/sale-info";
import client from "@/lib/client";
import CollectionContract from "@/lib/get-collection-contract";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Hex, NFT as NFTType } from "thirdweb";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import {
  MediaRenderer,
  NFTDescription,
  NFTMedia,
  NFTProvider,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";

export function GetItem({ address }: { address: string }) {
  const [selectedNft, setSelectedNft] = useState<NFTType>();
  const account = useActiveAccount();

  const contract = CollectionContract(address);

  const {
    data: NFTs,
    error,
    isLoading,
  } = useReadContract(getOwnedNFTs, {
    contract: contract,
    owner: account?.address as Hex,
    queryOptions: {
      enabled: !!account?.address,
    },
  });

  if (isLoading) return <Loading />;
  if (error) return <div>Error: {error.message}</div>;
  if (!account) return <Loading />;

  return (
    <div className="my-4">
      {!selectedNft ? (
        <div
          className={cn(
            "grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
            NFTs && NFTs.length > 0 && "grid"
          )}
        >
          {NFTs && NFTs.length > 0 ? (
            NFTs.map((nft: NFTType) => (
              <div
                key={nft.id.toString()}
                className="max-h-[400px] cursor-pointer rounded-lg border border-gray-500/50 bg-white/[.04] p-4"
                onClick={() => setSelectedNft(nft)}
              >
                <NFTProvider contract={contract} tokenId={nft.id}>
                  <NFTMedia className="w-full rounded-lg object-cover" />
                  <h2 className="mt-2 text-lg font-semibold">
                    {nft.metadata.name}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-200">
                    Token ID: {nft.id.toString()}
                  </p>
                  <NFTDescription className="mt-2 line-clamp-2 truncate text-sm" />
                </NFTProvider>
              </div>
            ))
          ) : (
            <EmptyText text="Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!" />
          )}
        </div>
      ) : (
        <div className="mt-0 flex max-w-full gap-8">
          <div className="flex w-full flex-col">
            <div>
              <MediaRenderer
                client={client}
                src={selectedNft.metadata.image}
                className="!h-auto !w-full rounded-lg bg-white/[.04]"
              />
            </div>
          </div>

          <div className="relative top-0 w-full max-w-full">
            <h1 className="mb-1 break-words text-3xl font-semibold">
              {selectedNft.metadata.name}
            </h1>
            <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
              #{selectedNft.id.toString()}
            </p>
            <p className="text-text dark:text-white/60">
              You&rsquo;re about to list the following item for sale.
            </p>

            <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg bg-transparent py-4">
              <SaleInfo nft={selectedNft} />
            </div>
            <div
              className="flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-200 py-3 text-sm text-black"
              onClick={() => setSelectedNft(undefined)}
            >
              Back
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
