/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Loading from "@/app/loading";
import BackButton from "@/components/common/back-button";
import LoadingScreen from "@/components/common/loading-screen";
import { Button } from "@/components/ui/button";
import DropdownCard from "@/components/ui/dropdown-card";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TransactionDialog, {
  TransactionStep,
} from "@/components/ui/transaction-dialog";
import useAutoFetch from "@/hooks/use-auto-fetch";
import CollectionContract from "@/lib/get-collection-contract";
import { cn } from "@/lib/utils";
import styles from "@/styles/p5-art-creator.module.scss";
import { User } from "@/types";
import { Input } from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  Link,
  Play,
  Plus,
  RefreshCcw,
  Search,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, useRef, useState } from "react";
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

interface Collection {
  address: string;
  name: string;
}

const P5ArtCreator: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [step, setStep] = useState<number>(1);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedOption, setSelectedOption] = useState<React.ReactNode | null>(
    null
  );
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const t = useTranslations("pjs");
  const account = useActiveAccount();

  const [traitType, setTraitType] = useState<string>("");
  const [attributeValue, setAttributeValue] = useState<string>("");
  const [attributesArray, setAttributesArray] = useState<Attribute[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectAddress, setSelectAddress] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");

  const handleFileUpload = (files: File | null) => {
    if (!files) return;

    const reader = new FileReader();
    reader.onload = (event) => setCode(event.target?.result as string);
    reader.readAsText(files);
  };

  const { data, loading } = useAutoFetch<User>(
    `/api/user?username=${account?.address}`,
    600000,
    account?.address
  );

  if (!account || loading) return <LoadingScreen />;

  const filteredOptions =
    (data?.address as unknown as Collection[])
      .filter((collection) =>
        collection?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((collection: Collection) => ({
        content: <DropdownCard address={collection.address} />,
        address: collection.address,
        name: collection.name,
      })) || [];

  const handleOptionSelect = (option: OptionContent): void => {
    setSelectAddress(option.address);
    setSelectedOption(option.content);
    setShowDropdown(false);
  };

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

  const handleContract = (contract: string) => {
    return CollectionContract(contract);
  };

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  const runCode = () => {
    try {
      setError(null);

      if (!code.trim()) {
        setError("Please enter code p5.js");
        return;
      }

      if (!previewRef.current) {
        setError("Not error preview!");
        return;
      }

      // Clear previous content
      previewRef.current.innerHTML = "";

      // Create new iframe
      const iframe = document.createElement("iframe");
      iframe.style.width = "400px";
      iframe.style.height = "400px";
      iframe.style.border = "none";
      previewRef.current.appendChild(iframe);

      const iframeDoc =
        iframe.contentDocument || iframe.contentWindow?.document;

      // Write content to iframe
      iframeDoc?.open();
      iframeDoc?.write(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
            <title></title>
          </head>
          <body>
            <script>
              try {
                ${code}
              } catch (e) {
                window.parent.postMessage({ 
                  type: 'p5-error', 
                  message: e.message 
                }, '*');
              }
            </script>
          </body>
        </html>
      `);
      iframeDoc?.close();

      // Error handling
      const errorHandler = (event: MessageEvent) => {
        if (event.data?.type === "p5-error") {
          setError(event.data.message);
          window.removeEventListener("message", errorHandler);
        }
      };
      window.addEventListener("message", errorHandler);
    } catch (e) {
      console.error("Error running code:", e);
      setError("System error! Please try again.");
    }
  };

  const random = () => {
    runCode(); // Simply rerun the code
  };

  const handleDownload = (format: string) => {
    const iframe = previewRef.current?.querySelector("iframe");
    if (!iframe) return;

    const canvas = iframe.contentDocument?.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      setIsDownloading(true);

      const file = new File([blob], `p5_art.${format}`, {
        type: `image/${format}`,
      });
      setFile(file);
      setStep(2);
      setIsDownloading(false);
    }, `image/${format}`);
  };

  console.log(file);

  return (
    <div className={cn("my-10", styles.container)}>
      {step === 1 && (
        <>
          <div className="flex w-full items-center justify-between">
            <h1 className="text-3xl">{t("p5")} </h1>
            <BackButton />
          </div>

          <div className="flex w-full gap-8">
            <div className="flex-1">
              <Suspense fallback={<Loading />}>
                <div className="mx-auto my-4 w-full max-w-5xl gap-4 rounded-lg border border-dashed dark:border-neutral-800">
                  <FileUpload onChange={handleFileUpload} />
                </div>
              </Suspense>

              <div className="flex w-full justify-center gap-4">
                <Button
                  onClick={runCode}
                  className={"bg-green-600 hover:bg-green-500 dark:text-white"}
                  disabled={isDownloading}
                >
                  {t("Run_code")}
                  <Play />
                </Button>
                <Button onClick={random} disabled={isDownloading}>
                  Random
                  <RefreshCcw />
                </Button>
                <Button
                  onClick={() => handleDownload("png")}
                  className={"bg-blue-600 hover:bg-blue-500 dark:text-white"}
                  disabled={isDownloading}
                >
                  {t("Download_PNG")}
                  <ArrowDown />
                </Button>
              </div>
            </div>
            <div className="flex-1">
              <div className={styles.previewContainer}>
                <h2>{t("Preview")} </h2>
                {error && (
                  <div className={styles.errorMessage}>
                    <h3>{t("Error")} </h3>
                    <pre>{error}</pre>
                  </div>
                )}
                <div ref={previewRef} className={styles.previewCanvas}></div>
              </div>

              <div className={styles.codeEditor}>
                <h2>{t("Source_code")} </h2>
                <Textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={cn(
                    "bg-background-light text-black dark:bg-neutral-900 dark:text-white",
                    styles.codeTextarea
                  )}
                  placeholder="Enter your p5.js code here..."
                />
              </div>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <div className="flex w-full flex-col justify-center">
          <div className="mx-auto max-w-3xl">
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
                  Collection <span className="text-red-600"> *</span>
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
                        Select a collection to create your NFT.
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
                          filteredOptions.length > 2 &&
                            "max-h-[300px] overflow-y-scroll"
                        )}
                      >
                        {/* Add search input at the top of dropdown */}
                        <div className="sticky top-0 z-10 border-b bg-white p-2 dark:bg-neutral-900">
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                              type="text"
                              placeholder={"Search collections..."}
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-8"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        {filteredOptions.length === 0 ? (
                          <div className="w-full p-4 text-center text-gray-500 dark:text-gray-400">
                            {searchQuery ? (
                              <p>No collections found</p>
                            ) : (
                              <p>
                                You don&apos;t have any collections. Please
                                create a collection first.{" "}
                                <span className="text-link">
                                  <Link href={"/create/collection"}>
                                    Create a new collection
                                  </Link>
                                </span>
                              </p>
                            )}
                          </div>
                        ) : (
                          filteredOptions.map((option, index) => (
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
                <Label
                  htmlFor="title"
                  className="text-sm/6 font-bold dark:text-text-dark"
                >
                  NFT Name <span className="text-red-600"> *</span>
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  placeholder={"Enter your NFT name"}
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
                  Description <span className="text-red-600"> *</span>
                </Label>
                <Textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2"
                />
                <p className="mt-3 text-sm/6">
                  Write a description for your item.{" "}
                </p>
              </div>

              {/* Attributes Input Fields */}
              <div>
                <Label>
                  Attributes <span className="text-gray-600">Optional</span>
                </Label>
                <div className="mt-2 flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={"Attribute Type"}
                      value={traitType}
                      onChange={(e) => setTraitType(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <Input
                      type="text"
                      placeholder={"Value"}
                      value={attributeValue}
                      onChange={(e) => setAttributeValue(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddAttribute}>Add</Button>
                </div>
              </div>

              {/* Display Attributes Array */}
              {attributesArray.length > 0 && (
                <div>
                  <Label>Added Attributes</Label>
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
                <TransactionButton
                  disabled={!name || !selectedOption || !file || !description}
                  className={"!w-full"}
                  transaction={() => {
                    const metadata = {
                      name,
                      description,
                      image: file,
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
                        image: file || undefined,
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
                  <span>Mint NFT</span>
                </TransactionButton>
              </div>
            </form>
            <Button
              className="mt-4 w-full"
              variant="destructive"
              onClick={() => setStep(1)}
            >
              Back to Step 1
            </Button>
          </div>
          <TransactionDialog
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
            currentStep={currentStep}
            title="Transaction Status"
            message={message}
          />
        </div>
      )}
    </div>
  );
};

export default P5ArtCreator;
