"use client";

import EmptyText from "@/components/common/empty-text";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import CollectionCard from "@/components/ui/collection-card";
import useAutoFetch from "@/hooks/use-auto-fetch";
import { Link } from "@/i18n/routing";
import { checkCollectionHasNFTs } from "@/lib/check-collection-has-nft";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

export const dynamic = "force-dynamic";

interface Collection {
  address: string;
  name: string;
}

export default function Buy() {
  const { data, error, loading } = useAutoFetch<Collection[]>(
    `/api/collection`,
    600000,
    "collection"
  );
  const t = useTranslations("buy");
  const [collectionsWithNFTs, setCollectionsWithNFTs] = useState<Collection[]>(
    []
  );
  const [loadingCollections, setLoadingCollections] = useState(true);

  useEffect(() => {
    const fetchCollectionsWithNFTs = async () => {
      if (data) {
        const collections = await Promise.all(
          data?.map(async (collection) => {
            const hasNFTs = await checkCollectionHasNFTs(collection.address);
            return hasNFTs ? collection : null;
          })
        );
        setCollectionsWithNFTs(collections.filter(Boolean) as Collection[]);
        setLoadingCollections(false);
      }
    };

    fetchCollectionsWithNFTs();
  }, [data]);

  if (loading || loadingCollections)
    return (
      <div className="mt-10">
        <NFTGridLoading />
      </div>
    );
  if (error) {
    toast.error(error.message);
    return <EmptyText text={`Error: ${error.message}`} />;
  }
  return (
    <div className="my-8">
      <Suspense fallback={<NFTGridLoading />}>
        <div
          className={cn(
            "grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
            collectionsWithNFTs.length > 0 && "grid"
          )}
        >
          {collectionsWithNFTs.length > 0 ? (
            collectionsWithNFTs.map((collection: Collection) => (
              <Link
                key={collection.address}
                href={`/buy/${collection.address}`}
              >
                <CollectionCard
                  address={collection.address}
                  name={collection.name}
                />
              </Link>
            ))
          ) : (
            <EmptyText text="Looks like there are no listed NFTs in this collection. Check back later!" />
          )}
        </div>
      </Suspense>
      <div className="mt-8 grid w-full place-content-center">
        <p className="text-sm font-bold">{t("End_of_listed_for_sale")} </p>
      </div>
    </div>
  );
}
