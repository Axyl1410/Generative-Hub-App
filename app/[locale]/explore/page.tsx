"use client";

import EmptyText from "@/components/common/empty-text";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import CollectionCard from "@/components/ui/collection-card";
import useAutoFetch from "@/hooks/use-auto-fetch";
import { Link } from "@/i18n/routing";
import { cn } from "@nextui-org/react";

export default function Page() {
  const { data, error, loading } = useAutoFetch<string[]>(
    `/api/collection`,
    600000,
    "collection"
  );

  if (error) <EmptyText text={`Error: ${error.message}`} />;

  return (
    <div className="my-6">
      {loading ? (
        <NFTGridLoading />
      ) : (
        <div
          className={cn(
            "grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
            data?.length && "grid"
          )}
        >
          {data?.length ? (
            <>
              {data.map((address) => (
                <Link key={address} href={`/explore/${address}`}>
                  <CollectionCard key={address} address={address} />
                </Link>
              ))}
            </>
          ) : (
            <EmptyText text="Looks like there are no collection. Check back later!" />
          )}
        </div>
      )}
    </div>
  );
}
