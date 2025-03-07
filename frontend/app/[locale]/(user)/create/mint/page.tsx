/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import BackButton from "@/components/common/back-button";
import Loading from "@/components/common/loading";
import LoadingScreen from "@/components/common/loading-screen";
import AttributeInput from "@/components/form/attribute-input";
import AttributeList from "@/components/form/attribute-list";
import CollectionDropdown from "@/components/form/collection-dropdown";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TransactionDialog, {
  TransactionStep,
} from "@/components/ui/transaction-dialog";
import useAttributes from "@/hooks/use-attributes";
import useAutoFetch from "@/hooks/use-auto-fetch";
import CollectionContract from "@/lib/get-collection-contract";
import { User } from "@/types";
import { useTranslations } from "next-intl";
import { Suspense, useState } from "react";
import { mintTo } from "thirdweb/extensions/erc721";
import { TransactionButton, useActiveAccount } from "thirdweb/react";

interface Collection {
  address: string;
  name: string;
}

export default function Page() {
  const [files, setFiles] = useState<File | null>();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const account = useActiveAccount();
  const [selectedOption, setSelectedOption] = useState<React.ReactNode | null>(
    null
  );
  const [selectAddress, setSelectAddress] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");
  const t = useTranslations("mint");

  const {
    traitType,
    setTraitType,
    attributeValue,
    setAttributeValue,
    attributesArray,
    handleAddAttribute,
    handleRemoveAttribute,
  } = useAttributes();

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  const handleFileUpload = (files: File | null) => setFiles(files);

  const { data, loading } = useAutoFetch<User>(
    `/api/user?username=${account?.address}`,
    600000,
    account?.address
  );

  if (!account || loading) return <LoadingScreen />;

  const handleContract = (contract: string) => {
    return CollectionContract(contract);
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
              <div className="mx-auto w-full max-w-5xl gap-4 rounded-lg border border-dashed border-gray-500 bg-white dark:border-neutral-600 dark:bg-black">
                <FileUpload
                  onChange={handleFileUpload}
                  allowedTypes={["image/*"]}
                />
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
              <CollectionDropdown
                data={data?.address as unknown as Collection[]}
                selectedOption={selectedOption}
                setSelectedOption={setSelectedOption}
                setSelectAddress={setSelectAddress}
              />

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

              <AttributeInput
                traitType={traitType}
                attributeValue={attributeValue}
                setTraitType={setTraitType}
                setAttributeValue={setAttributeValue}
                handleAddAttribute={handleAddAttribute}
              />

              {attributesArray.length > 0 && (
                <AttributeList
                  attributesArray={attributesArray}
                  handleRemoveAttribute={handleRemoveAttribute}
                />
              )}

              <div className={"h-[45px]"}>
                <TransactionButton
                  disabled={!name || !selectedOption || !files || !description}
                  className={"!w-full"}
                  transaction={() => {
                    const metadata = {
                      name,
                      description,
                      image: files,
                      attributes:
                        attributesArray.length > 0
                          ? attributesArray
                          : undefined,
                    };

                    setIsOpen(true);
                    setCurrentStep("sent");

                    return mintTo({
                      contract: handleContract(selectAddress as string) as any,
                      to: account.address,
                      nft: {
                        ...metadata,
                        image: files || undefined,
                      },
                    });
                  }}
                  onTransactionSent={() => {
                    setCurrentStep("confirmed");
                  }}
                  onTransactionConfirmed={() => {
                    setCurrentStep("success");
                    setMessage("Transaction is being confirmed...");
                  }}
                  onError={(error) => {
                    setCurrentStep("error");
                    setMessage("Transaction failed: " + error.message);
                  }}
                >
                  <span>{t("Mint_NFT")}</span>
                </TransactionButton>
              </div>
            </form>
          </div>
        </div>
      </div>
      <TransactionDialog
        isOpen={isOpen}
        onOpenChange={handleOpenChange}
        currentStep={currentStep}
        title="Transaction Status"
        message={message}
      />
    </div>
  );
}
