"use client";

import ListingGrid from "@/components/nft/listing-grid";
import { MARKETPLACE } from "@/contracts";

export function GetItem({ address }: { address: string }) {
  return <ListingGrid marketplace={MARKETPLACE} collection={address} />;
}
