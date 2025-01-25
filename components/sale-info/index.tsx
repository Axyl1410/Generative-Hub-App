import { NFT as NFTType } from "thirdweb";
import React, { useState } from "react";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { ADDRESS_ZERO } from "thirdweb";
import { isApprovedForAll } from "thirdweb/extensions/erc721";
import { MARKETPLACE, NFT_COLLECTION } from "@/contracts";
import AuctionListingButton from "./auction-listing-button";
import DirectListingButton from "./direct-listing-button";
import { cn } from "@/lib/utils";
import ApprovalButton from "./approve-button";

type Props = {
  nft: NFTType;
};

const INPUT_STYLES =
  "block w-full py-3 px-4 mb-4 bg-transparent border dark:border-white text-base box-shadow-md rounded-lg mb-4";
const LEGEND_STYLES = "mb-2 text-text dark:text-white/80";
export default function SaleInfo({ nft }: Props) {
  const account = useActiveAccount();
  const [tab, setTab] = useState<"direct" | "auction">("direct");

  const { data: hasApproval } = useReadContract(isApprovedForAll, {
    contract: NFT_COLLECTION,
    owner: account?.address || ADDRESS_ZERO,
    operator: MARKETPLACE.address,
  });

  const [directListingState, setDirectListingState] = useState({
    price: "0",
  });
  const [auctionListingState, setAuctionListingState] = useState({
    minimumBidAmount: "0",
    buyoutPrice: "0",
  });

  return (
    <>
      <div className="">
        <div className="mb-6 flex w-full justify-start border-b dark:border-white/60">
          <h3
            className={cn(
              "flex h-12 cursor-pointer items-center justify-center px-4 text-base font-semibold transition-all hover:text-gray-700 dark:hover:text-white/80",
              tab === "direct" && "border-b-2 border-[#0294fe] text-[#0294fe]"
            )}
            onClick={() => setTab("direct")}
          >
            Direct
          </h3>
          <h3
            className={cn(
              "flex h-12 cursor-pointer items-center justify-center px-4 text-base font-semibold transition-all hover:text-gray-700 dark:hover:text-white/80",
              tab === "auction" && "border-b-2 border-[#0294fe] text-[#0294fe]"
            )}
            onClick={() => setTab("auction")}
          >
            Auction
          </h3>
        </div>

        {/* Direct listing fields */}
        <div className={cn(tab === "direct" ? "flex" : "hidden", "flex-col")}>
          {/* Input field for buyout price */}
          <legend className={cn(LEGEND_STYLES)}> Price per token</legend>
          <input
            className={cn(INPUT_STYLES)}
            type="number"
            step={0.000001}
            value={directListingState.price}
            onChange={(e) => setDirectListingState({ price: e.target.value })}
          />
          {!hasApproval ? (
            <ApprovalButton />
          ) : (
            <DirectListingButton
              nft={nft}
              pricePerToken={directListingState.price}
            />
          )}
        </div>

        {/* Auction listing fields */}
        <div className={cn(tab === "auction" ? "flex" : "hidden", "flex-col")}>
          <legend className={cn(LEGEND_STYLES)}>
            {" "}
            Allow bids starting from{" "}
          </legend>
          <input
            className={cn(INPUT_STYLES)}
            step={0.000001}
            type="number"
            value={auctionListingState.minimumBidAmount}
            onChange={(e) =>
              setAuctionListingState({
                ...auctionListingState,
                minimumBidAmount: e.target.value,
              })
            }
          />

          <legend className={cn(LEGEND_STYLES)}> Buyout price </legend>
          <input
            className={cn(INPUT_STYLES)}
            type="number"
            step={0.000001}
            value={auctionListingState.buyoutPrice}
            onChange={(e) =>
              setAuctionListingState({
                ...auctionListingState,
                buyoutPrice: e.target.value,
              })
            }
          />

          {!hasApproval ? (
            <ApprovalButton />
          ) : (
            <AuctionListingButton
              nft={nft}
              minimumBidAmount={auctionListingState.minimumBidAmount}
              buyoutBidAmount={auctionListingState.buyoutPrice}
            />
          )}
        </div>
      </div>
    </>
  );
}
