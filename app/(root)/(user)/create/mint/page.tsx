"use client";

import { Suspense, useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import Loading from "@/components/common/loading";
import { Plus } from "lucide-react";
import BackButton from "@/components/common/back-button";
import { TransactionButton, useActiveAccount } from "thirdweb/react";
import { mintTo } from "thirdweb/extensions/erc721";
import { NFT_COLLECTION } from "@/contracts";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [files, setFiles] = useState<File>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  // const [supply, setSupply] = useState<number>(1);
  const account = useActiveAccount();

  const handleFileUpload = (files: File) => {
    setFiles(files);
    console.log(files);
  };

  if (!account) return <div>Please connect your wallet</div>;

  const address: string = account.address;

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
                // setSupply(1);
                setFiles(undefined);
              }}
            >
              <div>
                <label
                  htmlFor="collection"
                  className="text-sm/6 font-bold dark:text-text-dark"
                >
                  Collection*
                </label>
                <div className="mt-2 flex h-24 w-full cursor-not-allowed items-center gap-4 rounded-md bg-gray-100 p-4 shadow dark:border dark:bg-neutral-900">
                  <div className="grid h-16 w-16 place-items-center rounded-md bg-gray-200 dark:bg-neutral-800">
                    <Plus />
                  </div>
                  <p className="text-sm/6 font-bold">
                    Select a collection to mint your NFT.
                  </p>
                </div>
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

              {/*<div>*/}
              {/*  <label*/}
              {/*    htmlFor="supply"*/}
              {/*    className="text-sm/6 font-bold dark:text-text-dark"*/}
              {/*  >*/}
              {/*    Supply**/}
              {/*  </label>*/}
              {/*  <div className="mt-2">*/}
              {/*    <input*/}
              {/*      type="number"*/}
              {/*      name="supply"*/}
              {/*      id="supply"*/}
              {/*      placeholder="1"*/}
              {/*      className="w-full rounded-md bg-background px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"*/}
              {/*      required*/}
              {/*      value={supply}*/}
              {/*      onChange={(e) => setSupply(Number(e.target.value))}*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*</div>*/}

              <div>
                <label
                  htmlFor="description"
                  className="text-sm/6 font-bold text-gray-900 dark:text-text-dark"
                >
                  Description*
                </label>
                <div className="mt-2">
                  <textarea
                    name="description"
                    id="description"
                    rows={3}
                    className="w-full rounded-md bg-background px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <p className="mt-3 text-sm/6">Write a few description about.</p>
              </div>
              <TransactionButton
                transaction={() => {
                  toast.info("Minting NFT...");
                  const metadata = {
                    name,
                    description,
                    image: files,
                  };
                  return mintTo({
                    contract: NFT_COLLECTION,
                    to: address,
                    nft: metadata,
                  });
                }}
                onTransactionSent={() => {
                  toast.info("Offer Sent!");
                }}
                onTransactionConfirmed={() => {
                  toast.success("Offer Placed Successfully!");
                  setTimeout(() => {
                    router.push("/profile");
                  }, 2000);
                }}
                onError={(error) => {
                  toast.error("Error making offer: " + error.message);
                }}
              >
                Mint NFT
              </TransactionButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
