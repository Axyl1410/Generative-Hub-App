import CancelButton from "@/components/sale-info/cancel-button";
import { MARKETPLACE } from "@/contracts";
import CheckNFTListing from "@/lib/check-nft-listing";
import CollectionContract from "@/lib/get-collection-contract";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import { NFT as NFTType } from "thirdweb";
import { isApprovedForAll } from "thirdweb/extensions/erc721";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import Loading from "../common/loading";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import ApprovalButton from "./approve-button";
import AuctionListingButton from "./auction-listing-button";
import DirectListingButton from "./direct-listing-button";

type Props = {
  nft: NFTType;
  address: string;
};

export default function SaleInfo({ nft, address }: Props) {
  const account = useActiveAccount();
  const [tab, setTab] = useState<"direct" | "auction">("direct");
  const [loading, setLoading] = useState(true);

  const contract = CollectionContract(address);
  if (!contract) notFound();

  const { data: hasApproval } = useReadContract(isApprovedForAll, {
    contract: contract,
    owner: (account?.address as string) || "0x",
    operator: MARKETPLACE.address,
  });

  const listingStatus = CheckNFTListing({
    contractAddress: address,
    tokenId: nft.id.toString(),
  });

  const [directListingState, setDirectListingState] = useState({
    price: "0",
  });

  const [auctionListingState, setAuctionListingState] = useState({
    minimumBidAmount: "0",
    buyoutPrice: "0",
  });

  useEffect(() => {
    if (hasApproval !== undefined && !listingStatus.isLoading)
      setLoading(false);
  }, [hasApproval, listingStatus]);

  if (!account) return null;

  if (loading) return <Loading />;

  return (
    <>
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

      <motion.div layout style={{ height: "auto" }}>
        {/* Direct listing fields */}
        <div className={cn(tab === "direct" ? "flex" : "hidden", "flex-col")}>
          {/* Input field for buyout price */}
          <Label>Price per token</Label>

          <Input
            type="number"
            step={0.000001}
            min="0"
            value={directListingState.price}
            onChange={(e) => setDirectListingState({ price: e.target.value })}
            className="my-4"
          />
          {!hasApproval ? (
            <ApprovalButton contract={contract} />
          ) : listingStatus.isSell ? (
            <CancelButton id={listingStatus.listingId} type={"listing"} />
          ) : (
            <DirectListingButton
              nft={nft}
              pricePerToken={directListingState.price}
              address={address}
            />
          )}
        </div>

        {/* Auction listing fields */}
        <div className={cn(tab === "auction" ? "flex" : "hidden", "flex-col")}>
          <Label>Allow bids starting from</Label>

          <Input
            step={0.000001}
            type="number"
            min={0}
            value={auctionListingState.minimumBidAmount}
            onChange={(e) =>
              setAuctionListingState({
                ...auctionListingState,
                minimumBidAmount: e.target.value,
              })
            }
            className="my-4"
          />
          <Label>Buyout price</Label>
          <Input
            type="number"
            step={0.000001}
            min={0}
            value={auctionListingState.buyoutPrice}
            onChange={(e) =>
              setAuctionListingState({
                ...auctionListingState,
                buyoutPrice: e.target.value,
              })
            }
            className="my-4"
          />
          {!hasApproval ? (
            <ApprovalButton contract={contract} />
          ) : listingStatus.isSell ? (
            <CancelButton id={nft.id} type={"auction"} />
          ) : (
            <AuctionListingButton
              nft={nft}
              minimumBidAmount={auctionListingState.minimumBidAmount}
              buyoutBidAmount={auctionListingState.buyoutPrice}
              address={address}
            />
          )}
        </div>
      </motion.div>
    </>
  );
}
