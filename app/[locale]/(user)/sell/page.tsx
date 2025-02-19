"use client";

import LoadingScreen from "@/components/common/loading-screen";
import { NFTGridLoading } from "@/components/nft/nft-grid";
import CollectionCard from "@/components/ui/collection-card";
import useAutoFetch from "@/hooks/use-auto-fetch";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { NFT, User } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { useActiveAccount } from "thirdweb/react";

export const dynamic = "force-dynamic";

export default function Page() {
  const account = useActiveAccount();

  const { data, loading } = useAutoFetch<User>(
    `/api/user/get-user?username=${account?.address}`,
    600000,
    account?.address
  );

  if (!account) return <LoadingScreen />;

  if (loading)
    return (
      <div className="mt-4">
        <NFTGridLoading />
      </div>
    );

  return (
    <>
      <AnimatePresence>
        <motion.div
          className="my-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="mb-8">
            <h1 className="mb-2 text-xl font-semibold">My Collections</h1>
            <div
              className={cn(
                "grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
                data?.address && data.address.length > 0 && "grid"
              )}
            >
              {data?.address && data.address.length > 0 ? (
                data.address.map((address: string) => (
                  <Link href={`/sell/${address}`} key={address}>
                    <CollectionCard address={address} />
                  </Link>
                ))
              ) : (
                <p className="text-sm font-bold">No collection found</p>
              )}
            </div>
          </div>
          <h1 className="mb-2 text-xl font-bold">Other</h1>
          <div
            className={cn(
              "grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
              data?.nft && data.nft.length > 0 && "grid"
            )}
          >
            {data?.nft && data.nft.length > 0 ? (
              data.nft.map((nft: NFT) => (
                <Link href={`/sell/${nft.contract}`} key={nft.contract}>
                  <CollectionCard address={nft.contract} />
                </Link>
              ))
            ) : (
              <p className="text-sm font-bold">No collection found</p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}
