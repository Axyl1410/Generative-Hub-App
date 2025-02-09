/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import BackButton from "@/components/common/back-button";
import Loading from "@/components/common/loading";
import LoadingScreen from "@/components/common/loading-screen";
import DropdownCard from "@/components/ui/dropdown-card";
import { FileUpload } from "@/components/ui/file-upload";
import useAutoFetch from "@/hooks/use-auto-fetch";
import CollectionContract from "@/lib/get-collection-contract";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { mintTo } from "thirdweb/extensions/erc721";
import { TransactionButton, useActiveAccount } from "thirdweb/react";

interface OptionContent {
  content: React.ReactNode;
  address: string;
}

export default function Page() {
  const router = useRouter();
  const [files, setFiles] = useState<File>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const account = useActiveAccount();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectAddress, setSelectAddress] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<React.ReactNode | null>(
    null
  );

  const handleFileUpload = (files: File) => setFiles(files);

  const { data, loading } = useAutoFetch<User>(
    `api/user/get-user?username=${account?.address}`
  );

  if (!account || loading) return <LoadingScreen />;

  const handleOptionSelect = (option: OptionContent): void => {
    setSelectAddress(option.address);
    setSelectedOption(option.content);
    setShowDropdown(false);
  };

  const handleContract = (contract: string) => {
    return CollectionContract(contract);
  };

  const options =
    data?.address?.map((address) => ({
      content: <DropdownCard address={address} />,
      address: address,
    })) || [];

  return (
    <div className="my-10 flex w-full justify-center">
      <div className="flex w-full flex-col">
        <div className="flex flex-col-reverse justify-between gap-8 pb-10 md:flex-row">
          <div>
            <h1 className="text-xl font-bold sm:text-3xl">Create an NFT</h1>
            <p className="text-md font-bold sm:text-xl">
              Once your item is minted you will not be able to change any of its
              information.
            </p>
          </div>
          <BackButton className="h-fit" href="/create" />
        </div>
        <div className="flex w-full flex-col gap-12 md:flex-row">
          <div className="flex-1">
            <Suspense fallback={<Loading />}>
              <div className="mx-auto w-full max-w-5xl gap-4 rounded-lg border border-dashed border-border bg-white dark:border-neutral-800 dark:bg-black">
                <FileUpload onChange={handleFileUpload} />
              </div>
            </Suspense>
          </div>

          <div className="flex-1">
            <form
              className="flex flex-col gap-8"
              onSubmit={(e) => {
                e.preventDefault();
                setName("");
                setDescription("");
                setFiles(undefined);
                setSelectedOption(null);
                setSelectAddress(null);
              }}
            >
              <div>
                <label
                  htmlFor="collection"
                  className="text-sm/6 font-bold dark:text-text-dark"
                >
                  Collection*
                </label>
                <div
                  className="relative mt-2 flex h-24 w-full cursor-pointer items-center gap-4 overflow-hidden rounded-md bg-gray-100 p-4 shadow dark:border dark:bg-neutral-900"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {selectedOption || (
                    <>
                      <div className="grid h-16 w-16 place-items-center rounded-md bg-gray-200 dark:bg-neutral-800">
                        <Plus />
                      </div>

                      <p className="text-sm/6 font-bold">
                        Select a collection to mint your NFT.
                      </p>
                    </>
                  )}
                </div>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className={cn(
                          "z-10 w-full rounded-md bg-white shadow-lg dark:bg-neutral-900",
                          options.length > 2 &&
                            "max-h-[300px] overflow-y-scroll"
                        )}
                      >
                        {options.length === 0 ? (
                          <div className="w-full p-4 text-center text-gray-500 dark:text-gray-400">
                            <p>
                              You don&apos;t have any collections. Create one
                              first.{" "}
                              <span className="text-link">
                                <Link href={"/create/collection"}>Here</Link>
                              </span>
                            </p>
                          </div>
                        ) : (
                          options.map((option, index) => (
                            <div
                              key={index}
                              className={cn(
                                "w-full cursor-pointer border-y px-4 transition-colors hover:bg-gray-100 dark:hover:bg-neutral-800",
                                index === 0 && "border-t-0"
                              )}
                              onClick={() => handleOptionSelect(option)}
                            >
                              {option.content}
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <p className="mt-3 text-sm/6">
                  Not all collections are eligible.
                  <span className="cursor-not-allowed text-link">
                    Learn more
                  </span>
                </p>
              </div>

              <div>
                <label
                  htmlFor="title"
                  className="text-sm/6 font-bold dark:text-text-dark"
                >
                  Name*
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    placeholder="Name your NFT"
                    className="w-full rounded-md bg-background px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="text-sm/6 font-bold text-gray-900 dark:text-text-dark"
                >
                  Description
                </label>
                <div className="mt-2">
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="w-full rounded-md bg-background px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <p className="mt-3 text-sm/6">Write a few description about.</p>
              </div>
              <div className={"h-[45px]"}>
                <AnimatePresence>
                  {name && selectedOption && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TransactionButton
                        className={"!w-full"}
                        transaction={() => {
                          toast.info("Minting NFT...");
                          const metadata = {
                            name,
                            description,
                            image: files,
                          };
                          return mintTo({
                            contract: handleContract(
                              selectAddress as string
                            ) as any,
                            to: account.address,
                            nft: metadata,
                          });
                        }}
                        onTransactionSent={() => {
                          toast.info("Offer Sent!");
                        }}
                        onTransactionConfirmed={() => {
                          toast.success("Offer Placed Successfully!");
                          setTimeout(() => {
                            router.push("/sell");
                          }, 2000);
                        }}
                        onError={(error) => {
                          toast.error("Error making offer: ", {
                            description: error.message,
                          });
                        }}
                      >
                        Mint NFT
                      </TransactionButton>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
