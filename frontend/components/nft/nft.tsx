"use client";

import Skeleton from "@/components/skeleton/skeleton";
import { Link } from "@/i18n/routing";
import client from "@/lib/client";
import CollectionContract from "@/lib/get-collection-contract";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { NFT } from "thirdweb";
import { getNFT } from "thirdweb/extensions/erc721";
import { DirectListing, EnglishAuction } from "thirdweb/extensions/marketplace";
import { MediaRenderer } from "thirdweb/react";

type Props = {
  tokenId: bigint;
  nft?: NFT;
  directListing?: DirectListing;
  auctionListing?: EnglishAuction;
  overrideOnclickBehavior?: (nft: NFT) => void;
  address: string;
};

export default function NFTComponent({
  tokenId,
  directListing,
  auctionListing,
  address,
  ...props
}: Props) {
  const [nft, setNFT] = useState(props.nft);
  const contract = CollectionContract(address);

  if (!contract) notFound();

  useEffect(() => {
    if (nft?.id !== tokenId) {
      getNFT({
        contract: contract,
        tokenId: tokenId,
        includeOwner: true,
      }).then((nft) => {
        setNFT(nft);
      });
    }
  }, [tokenId, nft?.id, contract]);

  if (!nft) return <LoadingNFTComponent />;

  return (
    <Link href={`/token/${address}/${tokenId.toString()}`}>
      <div className="flex h-[400px] w-full cursor-pointer flex-col justify-stretch overflow-hidden rounded-lg border border-white/10 bg-white/[.04] transition-all hover:scale-105 hover:shadow-lg">
        <div className="relative w-full overflow-hidden bg-white/[.04]">
          {nft.metadata.image && (
            <MediaRenderer
              src={nft.metadata.image}
              client={client}
              className="aspect-square object-cover object-center"
              style={{ minHeight: "100%", width: "100%" }}
            />
          )}
        </div>
        <div className="flex w-full flex-1 items-center justify-between bg-gray-200 px-3 shadow dark:bg-neutral-800">
          <div className="flex flex-col justify-center py-3">
            <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-lg text-black dark:text-white">
              {nft.metadata.name}
            </p>
            <p className="text-sm font-semibold text-text dark:text-white/60">
              #{nft.id.toString()}
            </p>
            <p className={"mt-2 text-sm"}>{nft.metadata.description}</p>
          </div>

          {(directListing || auctionListing) && (
            <div className="flex flex-col items-end justify-center">
              <p className="mb-1 max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-medium text-text dark:text-white/60">
                Price
              </p>
              <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap text-text dark:text-white">
                {directListing
                  ? `${directListing?.currencyValuePerToken.displayValue}${directListing?.currencyValuePerToken.symbol}`
                  : `${auctionListing?.minimumBidCurrencyValue.displayValue}${auctionListing?.minimumBidCurrencyValue.symbol}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export function LoadingNFTComponent() {
  return (
    <div className="h-[350px] w-full rounded-lg">
      <Skeleton type="image" imageAspectRatio="4:3" height="350px" />
    </div>
  );
}
