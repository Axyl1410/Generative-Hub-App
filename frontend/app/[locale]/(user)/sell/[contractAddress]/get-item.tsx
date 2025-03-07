"use client";

import EmptyText from "@/components/common/empty-text";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import CollectionContract from "@/lib/get-collection-contract";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { notFound } from "next/navigation";
import { Hex, NFT as NFTType } from "thirdweb";
import { getOwnedNFTs } from "thirdweb/extensions/erc721";
import {
  NFTDescription,
  NFTMedia,
  NFTProvider,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";

export function GetItem({ address }: { address: string }) {
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
    <motion.div className="my-6">
      <AnimatePresence>
        <motion.div
          className={cn(
            "grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4",
            NFTs && NFTs.length > 0 && "grid"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {NFTs && NFTs.length ? (
            NFTs.map((nft: NFTType) => (
              <a key={nft.id.toString()} href={`/sell/${address}/${nft.id}`}>
                <motion.div
                  className="min-h-[400px] cursor-pointer rounded-lg border border-gray-500/50 bg-white/[.04] p-4 transition-all hover:scale-105"
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
              </a>
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
