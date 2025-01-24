"use client";

import NFTGrid, { NFTGridLoading } from "@/components/nft/nft-grid";
import SaleInfo from "@/components/sale-info";
import { NFT_COLLECTION } from "@/contracts";
import client from "@/lib/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { NFT as NFTType } from "thirdweb";
import { tokensOfOwner } from "thirdweb/extensions/erc721";
import { MediaRenderer, useActiveAccount } from "thirdweb/react";
import { Cross } from "lucide-react";
import BackButton from "@/components/common/back-button";

export const dynamic = "force-dynamic";

export default function Sell() {
  const [loading, setLoading] = useState(false);
  const [ownedTokenIds, setOwnedTokenIds] = useState<readonly bigint[]>([]);
  const [selectedNft, setSelectedNft] = useState<NFTType>();

  const account = useActiveAccount();
  useEffect(() => {
    if (account) {
      setLoading(true);
      tokensOfOwner({
        contract: NFT_COLLECTION,
        owner: account.address,
      })
        .then(setOwnedTokenIds)
        .catch((err) => {
          // Log the full error object for debugging
          console.error("Error fetching NFTs:", err);

          // Display a user-friendly error message
          toast.error("Something went wrong while fetching your NFTs!");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [account]);

  return (
    <div className={"mt-10"}>
      <div className={"flex w-full items-center justify-between"}>
        <h1 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl">
          Sell NFTs
        </h1>
        <BackButton className={"h-fit"} />
      </div>

      <div className="my-8">
        {!selectedNft ? (
          <>
            {loading ? (
              <NFTGridLoading />
            ) : (
              <NFTGrid
                nftData={ownedTokenIds.map((tokenId) => ({
                  tokenId,
                }))}
                overrideOnclickBehavior={(nft) => {
                  setSelectedNft(nft);
                }}
                emptyText={
                  !account
                    ? "Connect your wallet to list your NFTs!"
                    : "Looks like you don't own any NFTs in this collection. Head to the buy page to buy some!"
                }
              />
            )}
          </>
        ) : (
          <div className="mt-0 flex max-w-full gap-8">
            <div className="flex w-full flex-col">
              <div className="relative">
                <MediaRenderer
                  client={client}
                  src={selectedNft.metadata.image}
                  className="!h-auto !w-full rounded-lg bg-white/[.04]"
                />
                <button
                  onClick={() => {
                    setSelectedNft(undefined);
                  }}
                  className="absolute right-0 top-0 m-3 cursor-pointer transition-all hover:scale-110"
                >
                  <Cross size={24} />
                </button>
              </div>
            </div>

            <div className="relative top-0 w-full max-w-full">
              <h1 className="mb-1 break-words text-3xl font-semibold">
                {selectedNft.metadata.name}
              </h1>
              <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
                #{selectedNft.id.toString()}
              </p>
              <p className="text-white/60">
                You&rsquo;re about to list the following item for sale.
              </p>

              <div className="relative flex flex-1 flex-col overflow-hidden rounded-lg bg-transparent py-4">
                <SaleInfo nft={selectedNft} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
