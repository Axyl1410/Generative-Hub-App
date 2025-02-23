"use client";

import Loading from "@/components/common/loading";
import DropdownCard from "@/components/ui/dropdown-card";
import useAutoFetch from "@/hooks/use-auto-fetch";
import { Link } from "@/i18n/routing";
import { User } from "@/types";
import { useTranslations } from "next-intl";
import { useActiveAccount } from "thirdweb/react";

export const CollectedPage = () => {
  const account = useActiveAccount();
  const t = useTranslations("profile");
  const { data, loading } = useAutoFetch<User>(
    `api/user?username=${account?.address}`,
    600000,
    account?.address
  );

  if (loading || !account) return <Loading />;
  return (
    <>
      {/* Filters Section */}
      {/* <div className="mt-6 flex px-4">
        <div className="flex flex-wrap justify-center space-x-2">
          <button className="flex items-center space-x-2 rounded-md border px-4 py-2 hover:bg-gray-100">
            <i className="fas fa-filter"></i>
            <span>Status</span>
            <i className="fas fa-caret-down"></i>
          </button>
          <button className="flex items-center space-x-2 rounded-md border px-4 py-2 hover:bg-gray-100">
            <span>Chains</span>
            <i className="fas fa-caret-down"></i>
          </button>
          <input
            type="text"
            placeholder="Search by name"
            className="rounded-md border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="flex items-center space-x-2 rounded-md border px-4 py-2 hover:bg-gray-100">
            <span>Recently received</span>
            <i className="fas fa-caret-down"></i>
          </button>
          <button className="rounded-md border px-4 py-2 hover:bg-gray-100">
            <i className="fas fa-list"></i>
          </button>
          <button className="rounded-md border px-4 py-2 hover:bg-gray-100">
            <i className="fas fa-th"></i>
          </button>
        </div>
      </div> */}

      <div className="rounded-lg border-2 border-gray-200 py-6 text-lg">
        {data?.address && data.address.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.address.map((address: string) => (
              <div
                key={address}
                className="group relative border-r border-gray-300 transition-all duration-300 ease-in-out hover:-translate-y-1"
              >
                <Link
                  href={`/sell/${address}`}
                  className="block overflow-hidden rounded-lg border-2 border-transparent transition-all duration-300 ease-in-out group-hover:border-blue-500 group-hover:shadow-lg"
                >
                  <DropdownCard address={address} />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <>
            <p className="text-gray-500">{t("0_items")} </p>
            <div className="mt-4">
              <p className="text-gray-500">{t("0_collections")} </p>
              <button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
                {t("Back_to_all_items")}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
