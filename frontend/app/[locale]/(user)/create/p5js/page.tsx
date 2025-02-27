/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Loading from "@/app/loading";
import BackButton from "@/components/common/back-button";
import LoadingScreen from "@/components/common/loading-screen";
import AttributeInput from "@/components/form/attribute-input";
import AttributeList from "@/components/form/attribute-list";
import CollectionDropdown from "@/components/form/collection-dropdown";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TransactionDialog, {
  TransactionStep,
} from "@/components/ui/transaction-dialog";
import useAttributes from "@/hooks/use-attributes";
import useAutoFetch from "@/hooks/use-auto-fetch";
import CollectionContract from "@/lib/get-collection-contract";
import { cn } from "@/lib/utils";
import styles from "@/styles/p5-art-creator.module.scss";
import { User } from "@/types";
import { Input } from "@nextui-org/react";
import { ArrowDown, Play, RefreshCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, useRef, useState } from "react";
import { toast } from "sonner";
import { mintTo } from "thirdweb/extensions/erc721";
import { TransactionButton, useActiveAccount } from "thirdweb/react";

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
  const [selectedOption, setSelectedOption] = useState<React.ReactNode | null>(
    null
  );
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const t = useTranslations("pjs");
  const account = useActiveAccount();

  const {
    traitType,
    setTraitType,
    attributeValue,
    setAttributeValue,
    attributesArray,
    handleAddAttribute,
    handleRemoveAttribute,
  } = useAttributes();

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
      iframe.style.width = "100%";
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

  const handleStep = (format: string) => {
    const iframe = previewRef.current?.querySelector("iframe");
    if (!iframe) {
      toast.warning("No iframe found!", {
        description: "Please run the code first!",
      });
      return;
    }

    const canvas = iframe.contentDocument?.querySelector("canvas");
    if (!canvas) {
      toast.warning("No canvas found!", {
        description: "Please run the code first!",
      });
      return;
    }

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
                  onClick={() => handleStep("png")}
                  className={"bg-blue-600 hover:bg-blue-500 dark:text-white"}
                  disabled={isDownloading}
                >
                  Next Step with PNG
                  <ArrowDown />
                </Button>
              </div>
              <section className="mx-auto mt-4 max-w-md rounded-lg bg-gray-100 p-6 text-center shadow-md dark:bg-neutral-800">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Download an example project
                </h2>
                <p className="my-2 text-sm text-gray-600 dark:text-neutral-200">
                  Tải về file script mẫu để bắt đầu tạo NFT từ code của bạn.
                </p>

                <a
                  href="\scripts\sketch.js"
                  className="inline-block rounded-lg bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700"
                  download
                >
                  Download an example project
                </a>
              </section>
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
