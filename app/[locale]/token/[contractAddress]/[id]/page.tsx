import BackButton from "@/components/common/back-button";
import BuyListingButton from "@/components/token/buy-listing-button";
import CommentSection from "@/components/token/commentSection"; // ✅ Import CommentSection
import Events from "@/components/token/events";
import MakeOfferButton from "@/components/token/make-offer-button";
import { MARKETPLACE } from "@/contracts";
import client from "@/lib/client";
import CollectionContract from "@/lib/get-collection-contract";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { getNFT } from "thirdweb/extensions/erc721";
import {
  getAllValidAuctions,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";
import { Blobbie, MediaRenderer } from "thirdweb/react";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ contractAddress: string; id: string }>;
}) {
  const t = await getTranslations("token");

  const { contractAddress, id } = await params;
  const contract = CollectionContract(contractAddress);

  if (!contract) notFound();

  const listingsPromise = getAllValidListings({
    contract: MARKETPLACE,
  });
  const auctionsPromise = getAllValidAuctions({
    contract: MARKETPLACE,
  });

  const nftPromise = getNFT({
    contract: contract,
    tokenId: BigInt(id),
    includeOwner: true,
  });

  const [listings, auctions, nft] = await Promise.all([
    listingsPromise,
    auctionsPromise,
    nftPromise,
  ]);

  if (!nft.tokenURI) notFound();

  if (nft.owner === null) {
    nft.owner = "0x";
  }

  const directListing = listings?.find(
    (l) =>
      l.assetContractAddress === contractAddress && l.tokenId === BigInt(id)
  );

  const auctionListing = auctions?.find(
    (a) =>
      a.assetContractAddress === contractAddress && a.tokenId === BigInt(id)
  );
  return (
    <div className="mx-auto my-10 flex max-w-2xl flex-col gap-16 lg:max-w-full lg:flex-row">
      <div className="flex flex-1 flex-col">
        <BackButton className="mb-4 h-fit" href={"/buy"} />
        <MediaRenderer
          src={nft.metadata.image}
          client={client}
          className="!w-full rounded-lg bg-white/[.04]"
        />
        <div className="my-4 flex items-center justify-between">
          <div>
            <h1 className="mx-4 hyphens-auto break-words text-xl font-semibold lg:text-3xl">
              {nft.metadata.name}
            </h1>
            <p className="mx-4 overflow-hidden text-ellipsis whitespace-nowrap">
              #{nft.id.toString()}
            </p>
          </div>

          <div className="flex cursor-pointer items-center gap-4 transition-all hover:opacity-80">
            <Blobbie
              address={nft.owner}
              className="h-10 w-10 overflow-hidden rounded-full opacity-90 md:h-12 md:w-12"
            />
            {nft.owner && (
              <div className="flex flex-col">
                <p className="text-text dark:text-white/60">
                  {t("Current_Owner")}{" "}
                </p>
                <p className="font-medium text-text dark:text-white/90">
                  {nft.owner.slice(0, 8)}...
                  {nft.owner.slice(-4)}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="px-4">
          <h3 className="mt-8">{t("History")} </h3>
          <Events tokenId={nft.id} address={contractAddress} />
        </div>
      </div>

      <div className="sticky w-full flex-shrink sm:min-w-[370px] lg:max-w-[550px]">
        <div className="relative mb-6 flex w-full grow flex-col overflow-hidden rounded-lg bg-transparent">
          <div className="w-full rounded-lg bg-white/[.04] p-4">
            <p className="mb-1 text-text dark:text-white/60">Price</p>
            <div className="rounded-md text-lg font-medium text-text dark:text-white/90">
              {directListing ? (
                <>
                  {directListing?.currencyValuePerToken.displayValue}
                  {" " + directListing?.currencyValuePerToken.symbol}
                </>
              ) : auctionListing ? (
                <>
                  {auctionListing?.buyoutCurrencyValue.displayValue}
                  {" " + auctionListing?.buyoutCurrencyValue.symbol}
                </>
              ) : (
                "Not for sale"
              )}
            </div>
            <div>
              {auctionListing && (
                <>
                  <p className="text-textdark:text-white/60 my-4">
                    {t("Bids_starting_from")}
                  </p>
                  <div className="font-lg rounded-md font-medium text-text dark:text-white/90">
                    {auctionListing?.minimumBidCurrencyValue.displayValue}
                    {" " + auctionListing?.minimumBidCurrencyValue.symbol}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <BuyListingButton
            directListing={directListing}
            auctionListing={auctionListing}
            contractAddress={contractAddress}
            tokenId={id.toString()}
          />

          <div className="my-4 flex w-full justify-center text-center">
            <p className="text-text dark:text-white/60">or</p>
          </div>
          <MakeOfferButton
            auctionListing={auctionListing}
            directListing={directListing}
          />

          {/* ✅ Thêm Comment Section */}
          <CommentSection tokenId={id.toString()} />
        </div>
      </div>
    </div>
  );
}
