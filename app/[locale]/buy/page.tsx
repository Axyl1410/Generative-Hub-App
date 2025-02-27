"use client";

import EmptyText from "@/components/common/empty-text";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import CollectionCard from "@/components/ui/collection-card";
import useAutoFetch from "@/hooks/use-auto-fetch";
import { Link } from "@/i18n/routing";
import { checkCollectionHasNFTs } from "@/lib/check-collection-has-nft";
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
  const [loadingCollections, setLoadingCollections] = useState(false);

  useEffect(() => {
    if (!data) return;

    setLoadingCollections(true);

    // Process collections in smaller batches to avoid blocking the main thread
    const batchSize = 5;
    const processCollections = async () => {
      const result: Collection[] = [];

      for (let i = 0; i < data.length; i += batchSize) {
        const batch = data.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map(async (collection) => {
            const hasNFTs = await checkCollectionHasNFTs(collection.address);
            return hasNFTs ? collection : null;
          })
        );

        result.push(...(batchResults.filter(Boolean) as Collection[]));

        // Update state incrementally to show progress
        setCollectionsWithNFTs([...result]);
      }

      setLoadingCollections(false);
    };

    processCollections();
  }, [data]);

  if (loading)
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
        <div className="min-h-[200px]">
          {loadingCollections && (
            <div className="mb-4 animate-pulse text-sm font-medium text-gray-500">
              {collectionsWithNFTs.length > 0
                ? "Loading more collections..."
                : "Searching for available collections..."}
            </div>
          )}

          {collectionsWithNFTs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {collectionsWithNFTs.map((collection: Collection) => (
                <Link
                  key={collection.address}
                  href={`/buy/${collection.address}`}
                  className="transition-transform hover:scale-[1.01]"
                >
                  <CollectionCard
                    address={collection.address}
                    name={collection.name}
                  />
                </Link>
              ))}
            </div>
          ) : (
            !loadingCollections && (
              <EmptyText text="Looks like there are no listed NFTs in this collection. Check back later!" />
            )
          )}

          {collectionsWithNFTs.length > 0 && !loadingCollections && (
            <div className="mt-8 grid w-full place-content-center">
              <p className="text-sm font-bold">{t("End_of_listed_for_sale")}</p>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
}
