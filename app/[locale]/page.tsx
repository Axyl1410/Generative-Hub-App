"use client";

import EmptyText from "@/components/common/empty-text";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import CollectionCard from "@/components/ui/collection-card";
import useAutoFetch from "@/hooks/use-auto-fetch";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Collection {
  address: string;
  name: string;
}

export default function Page() {
  const t = useTranslations("home");

  const { data, error, loading } = useAutoFetch<Collection[]>(
    `/api/collection`,
    600000,
    "collection"
  );

  if (error) <EmptyText text={`Error: ${error.message}`} />;

  return (
    <div className="w-full bg-background-light py-10 dark:bg-background-dark">
      <div className="mx-auto max-w-7xl text-center">
        <p className="text-xl font-bold text-black dark:text-white md:text-4xl">
          {t("title")}
        </p>
        <p className="mx-auto max-w-2xl py-4 text-sm text-neutral-500 md:text-lg">
          {t("content")}
        </p>
      </div>
      <div className="mb-6 font-semibold uppercase">Collection list</div>
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
              {data.map((collection) => (
                <Link
                  key={collection.address}
                  href={`/explore/${collection.address}`}
                >
                  <CollectionCard address={collection.address} />
                </Link>
              ))}
            </>
          ) : (
            <EmptyText text="Looks like there are no listed NFTs in this collection. Check back later!" />
          )}
        </div>
      )}
    </div>
  );
}
