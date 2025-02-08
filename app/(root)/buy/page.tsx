"use client";

import EmptyText from "@/components/common/empty-text";
import ListingGrid from "@/components/nft/listing-grid";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import { MARKETPLACE } from "@/contracts";
import useAutoFetch from "@/hooks/use-auto-fetch";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function Buy() {
  const { data, error, loading } = useAutoFetch<string[]>(
    `/api/collection/get-collection`
  );

  if (loading || !data)
    return (
      <div className="mt-10">
        <NFTGridLoading />
      </div>
    );
  if (error) return <EmptyText text={`Error: ${error.message}`} />;

  return (
    <div className="my-8">
      <Suspense fallback={<NFTGridLoading />}>
        <div className="grid grid-cols-1 justify-start gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {data?.length > 0 && (
            <>
              {data.map((address: string) => (
                <ListingGrid
                  key={address}
                  marketplace={MARKETPLACE}
                  collection={address}
                />
              ))}
            </>
          )}
        </div>
      </Suspense>
      <div className="mt-8 grid w-full place-content-center">
        <p className="text-sm font-bold">End of listed for sale</p>
      </div>
    </div>
  );
}
