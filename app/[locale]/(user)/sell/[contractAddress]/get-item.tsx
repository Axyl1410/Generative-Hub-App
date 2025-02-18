"use client";

import EmptyText from "@/components/common/empty-text";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import SaleInfo from "@/components/sale-info";
import { Badge } from "@/components/ui/badge";
import client from "@/lib/client";
import CollectionContract from "@/lib/get-collection-contract";
import { cn } from "@/lib/utils";
import { Attribute } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { notFound } from "next/navigation";
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
  const [selectedNft, setSelectedNft] = useState<NFTType | null>(null);
  const account = useActiveAccount();
  const contract = CollectionContract(address);

  if (!contract) notFound();

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

  if (!account || isLoading) return <GetItemLoading />;
  if (error) return <EmptyText text={`Error: ${error.message}`} />;

  return (
    <motion.div className="my-6" layout style={{ height: "auto" }}>
      <AnimatePresence>
        {!selectedNft ? (
          <motion.div
            className={cn(
              "grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
              NFTs && NFTs.length > 0 && "grid"
            )}
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {NFTs && NFTs.length > 0 ? (
              NFTs.map((nft: NFTType) => (
                <motion.div
                  key={nft.id.toString()}
                  className="max-h-[400px] cursor-pointer rounded-lg border border-gray-500/50 bg-white/[.04] p-4 transition-all hover:scale-105"
                  onClick={() => setSelectedNft(nft)}
                  layout
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                >
                  <NFTProvider contract={contract} tokenId={nft.id}>
                    <NFTMedia className="aspect-square w-full rounded-lg object-cover object-center" />
                    <h2 className="mt-2 text-lg font-semibold">
                      {nft.metadata.name}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-200">
                      Token ID: {nft.id.toString()}
                    </p>
                    <NFTDescription className="mt-2 line-clamp-2 truncate text-sm" />
                  </NFTProvider>
                </motion.div>
              ))
            ) : (
              <>
                <EmptyText
                  text="Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!"
                  link="/create/mint"
                  textLink="Mint now"
                />
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            className="mt-0 flex max-w-full flex-col gap-8 sm:flex-row"
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="flex w-full flex-col"
              layoutId={`image-${selectedNft.id}`}
            >
              <MediaRenderer
                client={client}
                src={selectedNft.metadata.image}
                className="!h-auto !w-full rounded-lg bg-white/[.04]"
              />
            </motion.div>

            <motion.div
              className="relative top-0 w-full max-w-full"
              layoutId={`content-${selectedNft.id}`}
            >
              <h1 className="mb-1 break-words text-3xl font-semibold">
                {selectedNft.metadata.name}
              </h1>
              <p className="mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                {selectedNft.metadata.description}
              </p>
              <p className="mt-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                #{selectedNft.id.toString()}
              </p>
              <div className="mt-1 flex gap-2">
                {selectedNft.metadata.attributes &&
                  (
                    selectedNft.metadata.attributes as unknown as Attribute[]
                  ).map((attr: Attribute, index: number) => (
                    <Badge key={index}>
                      {attr.trait_type} : {attr.value}
                    </Badge>
                  ))}
              </div>
              <p className="mt-1 text-text dark:text-white/60">
                You&rsquo;re about to list the following item for sale.
              </p>

              <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg bg-transparent py-4">
                <SaleInfo nft={selectedNft} address={address} />
              </div>
              <div
                className="flex w-full cursor-pointer items-center justify-center rounded-md bg-gray-200 py-3 text-sm text-black"
                onClick={() => setSelectedNft(null)}
              >
                Back
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function GetItemLoading() {
  return (
    <div className="mt-6">
      <NFTGridLoading />
    </div>
  );
}
