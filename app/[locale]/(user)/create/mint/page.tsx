/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import BackButton from "@/components/common/back-button";
import Loading from "@/components/common/loading";
import LoadingScreen from "@/components/common/loading-screen";
import { Button } from "@/components/ui/button";
import DropdownCard from "@/components/ui/dropdown-card";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAutoFetch from "@/hooks/use-auto-fetch";
import { Link, useRouter } from "@/i18n/routing";
import CollectionContract from "@/lib/get-collection-contract";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import { toast } from "sonner";
import { mintTo } from "thirdweb/extensions/erc721";
import { TransactionButton, useActiveAccount } from "thirdweb/react";

interface OptionContent {
  content: React.ReactNode;
  address: string;
}

interface Attribute {
  trait_type: string;
  value: string;
}

export default function Page() {
  const router = useRouter();
  const [files, setFiles] = useState<File | null>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const account = useActiveAccount();
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectAddress, setSelectAddress] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<React.ReactNode | null>(
    null
  );
  const t = useTranslations("mint");

  // Attribute states
  const [traitType, setTraitType] = useState<string>("");
  const [attributeValue, setAttributeValue] = useState<string>("");
  const [attributesArray, setAttributesArray] = useState<Attribute[]>([]);

  const handleFileUpload = (files: File | null) => setFiles(files);

  const { data, loading } = useAutoFetch<User>(
    `/api/user/get-user?username=${account?.address}`,
    600000,
    account?.address
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

  const handleAddAttribute = () => {
    if (traitType.trim() && attributeValue.trim()) {
      // Check if traitType and attributeValue are not empty after trimming whitespace
      setAttributesArray([
        ...attributesArray,
        { trait_type: traitType, value: attributeValue },
      ]);
      setTraitType("");
      setAttributeValue("");
    } else toast.error(" attributeValue are not empty ");
  };

  const handleRemoveAttribute = (indexToRemove: number) => {
    setAttributesArray(
      attributesArray.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="my-10 flex w-full justify-center">
      <div className="flex w-full flex-col">
        <div className="flex flex-col-reverse justify-between gap-8 pb-10 md:flex-row">
          <div>
            <h1 className="text-xl font-bold sm:text-3xl">{t("title")}</h1>
            <p className="text-md font-bold sm:text-xl">{t("k")}</p>
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
              }}
            >
              <div>
                <Label
                  htmlFor="collection"
                  className="text-sm/6 font-bold dark:text-text-dark"
                >
                  {t("Collection")} <span className="text-red-600"> *</span>
                </Label>
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
                        {t("Select_a_collection")}
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
                              {t("You_don_apost")}{" "}
                              <span className="text-link">
                                <Link href={"/create/collection"}>
                                  {t("create_one")}
                                </Link>
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
                  {t("notall")}
                  <span className="cursor-not-allowed text-link">
                    {t("Learn_more")}
                  </span>
                </p>
              </div>

              <div>
                <Label
                  htmlFor="title"
                  className="text-sm/6 font-bold dark:text-text-dark"
                >
                  {t("name_label")} <span className="text-red-600"> *</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder={t("name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-2"
                />
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-sm/6 font-bold text-gray-900 dark:text-text-dark"
                >
                  {t("description_label")}{" "}
                  <span className="text-red-600"> *</span>
                </Label>
                <Textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                />
                <p className="mt-3 text-sm/6">{t("Write_a_few")} </p>
              </div>

              {/* Attributes Input Fields */}
              <div>
                <Label>
                  {t("Attributes")}{" "}
                  <span className="text-gray-600">({t("Optional")} )</span>
                </Label>
                <div className="mt-2 flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={t("trait_type_placeholder")}
                      value={traitType}
                      onChange={(e) => setTraitType(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={t("value_placeholder")}
                      value={attributeValue}
                      onChange={(e) => setAttributeValue(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddAttribute}>{t("Add")}</Button>
                </div>
              </div>

              {/* Display Attributes Array */}
              {attributesArray.length > 0 && (
                <div>
                  <Label> {t("Added_Attributes")}</Label>
                  <ul className="mt-2 space-y-2">
                    <AnimatePresence>
                      {attributesArray.map((attribute, index) => (
                        <motion.li
                          key={index}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between rounded-md bg-gray-100 px-3 py-1.5 dark:bg-neutral-800"
                        >
                          <div>
                            <span className="font-semibold dark:text-white">
                              {attribute.trait_type}:
                            </span>{" "}
                            <span className="text-gray-700 dark:text-gray-300">
                              {attribute.value}
                            </span>
                          </div>
                          <button
                            type="button"
                            className="rounded-full p-1 hover:bg-gray-200 dark:hover:bg-neutral-700"
                            onClick={() => handleRemoveAttribute(index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>
              )}

              <div className={"h-[45px]"}>
                <AnimatePresence>
                  {name && selectedOption && files && description && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <TransactionButton
                        className={"!w-full"}
                        transaction={() => {
                          toast.info(t("minting_nft"));

                          const metadata = {
                            name,
                            description,
                            image: files,
                            attributes:
                              attributesArray.length > 0
                                ? attributesArray
                                : undefined, // Include attributes if array is not empty
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
                          toast.info(t("offer_sent"));
                        }}
                        onTransactionConfirmed={() => {
                          toast.success(t("offer_placed_successfully"));
                          setTimeout(() => {
                            router.push("/sell");
                          }, 2000);
                        }}
                        onError={(error) => {
                          toast.error(t("error_making_offer"), {
                            description: error.message,
                          });
                        }}
                      >
                        {t("Mint_NFT")}
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
