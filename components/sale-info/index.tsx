import { MARKETPLACE, NFT_COLLECTION } from "@/contracts";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { NFT as NFTType } from "thirdweb";
import { isApprovedForAll } from "thirdweb/extensions/erc721";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import ApprovalButton from "./approve-button";
import AuctionListingButton from "./auction-listing-button";
import DirectListingButton from "./direct-listing-button";
import { getListing } from "thirdweb/extensions/marketplace";
import CheckNFTListing from "@/lib/check-nft-listing";

type Props = {
  nft: NFTType;
};

export default function SaleInfo({ nft }: Props) {
  const account = useActiveAccount();
  const [tab, setTab] = useState<"direct" | "auction">("direct");

  const { data: hasApproval } = useReadContract(isApprovedForAll, {
    contract: NFT_COLLECTION,
    owner: (account?.address as string) || "0x",
    operator: MARKETPLACE.address,
  });

  const { data: isListing } = useReadContract(getListing, {
    contract: MARKETPLACE,
    listingId: nft.id,
  });

  console.log("is listing", isListing, nft.id);

  console.log(
    "2",
    CheckNFTListing({
      contractAddress: NFT_COLLECTION.address,
      tokenId: nft.id.toString(),
    })
  );

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
          <legend className={"legend-styles"}> Price per token</legend>
          <input
            className={"input-styles"}
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
          <legend className={"legend-styles"}>
            {" "}
            Allow bids starting from{" "}
          </legend>
          <input
            className={"input-styles"}
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

          <legend className={"legend-styles"}> Buyout price </legend>
          <input
            className={"input-styles"}
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
