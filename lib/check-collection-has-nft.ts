import { MARKETPLACE } from "@/contracts";
import {
  getAllValidAuctions,
  getAllValidListings,
} from "thirdweb/extensions/marketplace";

export async function checkCollectionHasNFTs(
  collection: string
): Promise<boolean> {
  const listingsPromise = getAllValidListings({
    contract: MARKETPLACE,
  });
  const auctionsPromise = getAllValidAuctions({
    contract: MARKETPLACE,
  });

  const [listings, auctions] = await Promise.all([
    listingsPromise,
    auctionsPromise,
  ]);

  const hasListings = listings.some(
    (listing) => listing.assetContractAddress === collection
  );
  const hasAuctions = auctions.some(
    (auction) => auction.assetContractAddress === collection
  );

  return hasListings || hasAuctions;
}
