"use client";

import BackButton from "@/components/common/back-button";
import LoadingScreen from "@/components/common/loading-screen";
import { Button } from "@/components/ui/button";
import ButtonGradiant from "@/components/ui/button-gradiant";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Dialog from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import TransactionDialog, {
  TransactionStep,
} from "@/components/ui/transaction-dialog";
import { useGenerateDescription } from "@/hooks/use-auto-generate-desc";
import useToggle from "@/hooks/use-state-toggle";
import axios from "@/lib/axios-config";
import client, { FORMA_SKETCHPAD } from "@/lib/client";
import TakeMetadata from "@/lib/take-metadata";
import { waitForContractDeployment } from "@/lib/waitForContractDeployment";
import { AnimatePresence, motion } from "motion/react";
import { Eye, EyeOff, Info, Newspaper } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import { deployERC721Contract } from "thirdweb/deploys";
import { useActiveAccount } from "thirdweb/react";

interface DialogContentProps {
  title: string;
  description: string;
  onClose: () => void;
}

function useLazyLoading() {
  const account = useActiveAccount();
  if (!account) {
    return { isLoading: true };
  }
  return { isLoading: false, account };
}

export default function Page() {
  // Account loading hook
  const { isLoading, account } = useLazyLoading();

  // State hooks
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [files, setFiles] = useState<File | null>();
  const [royalty, setRoyalty] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const t = useTranslations("collection");
  // Toggle hooks
  const logoInfo = useToggle();
  const contractInfo = useToggle();
  const tokenInfo = useToggle();

  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<TransactionStep>("sent");
  const [message, setMessage] = useState("");

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  // Utility functions
  const generateTokenSymbol = useCallback((name: string): string => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return "";
    if (words.length === 1) {
      return words[0].substring(0, 3).toUpperCase();
    }
    return words
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }, []);

  // Event handlers
  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      setName(newName);
      setSymbol(generateTokenSymbol(newName));
    },
    [generateTokenSymbol]
  );

  const handleFileUpload = useCallback((files: File | null) => {
    setFiles(files);
  }, []);

  const { generateDescription, isGenerating } = useGenerateDescription({
    timeout: 10000,
  });

  const handleGenerateDescription = useCallback(async () => {
    const categories = [
      "art",
      "futuristic",
      "mythology",
      "abstract",
      "nature",
      "luxury",
    ];

    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    try {
      if (!name) {
        toast.warning("Please enter a collection name first");
        return;
      }

      const generatedDescription = await generateDescription(
        name,
        randomCategory
      );

      if (generatedDescription) {
        const cleanDescription = generatedDescription
          .replace(/\*\*/g, "")
          .replace(`${name}: `, "");

        setDescription(cleanDescription);
      }
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error("Failed to generate description");
    }
  }, [generateDescription, name]);

  if (!account) <LoadingScreen />;

  const handle = useCallback(async () => {
    if (!account) return;

    setLoading(true);
    setIsOpen(true);
    setCurrentStep("sent");
    try {
      const contractObject = Promise.resolve(
        deployERC721Contract({
          chain: FORMA_SKETCHPAD,
          client,
          account: account,
          type: "TokenERC721",
          params: {
            platformFeeRecipient: process.env.NEXT_PUBLIC_RECIPIENT_ADDRESS,
            platformFeeBps: BigInt(200),
            royaltyRecipient: account.address,
            royaltyBps: BigInt(royalty * 100),
            name,
            description,
            symbol,
            image: files ?? undefined,
          },
        })
          .catch((error) => {
            throw error;
          })
          .finally(() => {
            setCurrentStep("confirmed");
          })
      );

      const unwrapped = await contractObject;

      let contractAddress: string | undefined = undefined;

      if (
        typeof unwrapped === "object" &&
        unwrapped !== null &&
        "w" in unwrapped
      ) {
        const obj = unwrapped as { w: [string, string] };
        contractAddress = obj.w[1];
      } else if (typeof unwrapped === "string") {
        contractAddress = unwrapped;
      }

      if (!contractAddress)
        throw new Error("Failed to extract contract address");

      console.log("Contract address:", contractAddress);
      await waitForContractDeployment(contractAddress);

      const { metadata } = TakeMetadata(contractAddress);

      await axios.post("/api/user", {
        username: account.address,
        address: contractAddress,
        name: (await metadata).name as string,
      });

      await axios.post("/api/collection", {
        address: contractAddress,
        name: (await metadata).name as string,
      });
      setCurrentStep("success");
    } catch (error) {
      console.error(error);
      setCurrentStep("error");
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setMessage("Failed to deploy contract: " + errorMessage);
    } finally {
      setLoading(false);
    }
  }, [account, royalty, name, description, symbol, files]);

  const handleContinue = useCallback(() => {
    if (!name) {
      toast.warning(t("name_required"));
      return;
    }
    if (!files) {
      toast.warning(t("image_required"));
      return;
    }
    handle();
  }, [name, files, handle, t]);

  if (isLoading || !account) return <LoadingScreen />;

  const allowedTypes = ["image/*"];

  return (
    <div className="mt-10 flex w-full justify-center">
      <div className="flex w-full flex-col">
        <BackButton href="/create" className="mb-8 w-fit" />
        <div className="mb-8 flex grid-cols-6 flex-col-reverse gap-12 md:grid">
          <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-xl font-bold sm:text-3xl">
                Let&#39;{t("s_create")}
              </h1>
              <p className="text-md">
                {t("need_to_deplop")}{" "}
                <span className="cursor-not-allowed text-link">
                  {t("what_is_a_contract")}
                </span>
              </p>
            </div>
            <div>
              <p className="mb-2 flex items-center font-bold dark:text-text-dark">
                {t("Logo_image")}
                <span className="ml-1 cursor-pointer" onClick={logoInfo.open}>
                  <Info size={16} />
                </span>
              </p>
              <div className="mx-auto rounded-lg border border-dashed border-border bg-white dark:border-neutral-800 dark:bg-black">
                <FileUpload
                  onChange={handleFileUpload}
                  allowedTypes={allowedTypes}
                />
              </div>
              <Dialog isOpen={logoInfo.isOpen} onClose={logoInfo.close}>
                <DialogContent
                  title="Logo image"
                  description={t("logo_info")}
                  onClose={logoInfo.close}
                />
              </Dialog>
            </div>
            <div className="grid gap-4 sm:grid-cols-5">
              <div className="sm:col-span-3">
                <Label htmlFor="contract" className="flex items-center">
                  {t("Contract_name")} <span className="text-red-600"> *</span>
                  <span
                    className="ml-1 cursor-pointer"
                    onClick={contractInfo.open}
                  >
                    <Info size={16} />
                  </span>
                </Label>
                <Input
                  type="text"
                  name="contract"
                  id="contract"
                  placeholder="My collection name"
                  required
                  value={name}
                  onChange={handleNameChange}
                  className="mt-2"
                />
                <Dialog
                  isOpen={contractInfo.isOpen}
                  onClose={contractInfo.close}
                >
                  <DialogContent
                    title="Contract name"
                    description={t("contract_name_info")}
                    onClose={contractInfo.close}
                  />
                </Dialog>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="mcn" className="flex items-center">
                  {t("Token_symbol")}
                  <span
                    className="ml-1 cursor-pointer"
                    onClick={tokenInfo.open}
                  >
                    <Info size={16} />
                  </span>
                </Label>
                <Input
                  type="text"
                  name="mcn"
                  id="mcn"
                  placeholder="MCN"
                  value={symbol}
                  readOnly
                  className="mt-2"
                />
                <Dialog isOpen={tokenInfo.isOpen} onClose={tokenInfo.close}>
                  <DialogContent
                    title="Token symbol"
                    description={t("token_symbol_info")}
                    onClose={tokenInfo.close}
                  />
                </Dialog>
              </div>
            </div>
            <div className="w-full">
              <Label htmlFor="description">
                {t("Description")} <span className="text-red-600"> *</span>
                <button
                  onClick={handleGenerateDescription}
                  disabled={isGenerating || !name}
                  className="ml-2 inline-flex items-center rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-400"
                  type="button"
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span className="text-xs">
                        {t("description_analyzing")}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span>✨</span>
                      <span className="text-xs">{"Generate"}</span>
                    </div>
                  )}
                </button>
              </Label>
              <div className="mt-2">
                <Textarea
                  name="description"
                  id="description"
                  rows={3}
                  placeholder="Write a few description about."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full">
              <Label className="flex flex-col">Royalties (0-5%)</Label>
              <Input
                type="number"
                className="mt-2 w-full"
                min={0}
                max={5}
                placeholder="0"
                onChange={(e) => setRoyalty(parseFloat(e.target.value) || 0)}
              />
              <AnimatePresence>
                {(royalty < 0 || royalty > 5) && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: royalty < 0 || royalty > 5 ? 1 : 0,
                      height: royalty < 0 || royalty > 5 ? "auto" : 0,
                    }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-1 text-sm text-red-500"
                  >
                    Royalty must be between 0 and 5%
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
            <div className="flex justify-end">
              <ButtonGradiant
                text={loading ? t("loading") : t("loading")}
                onClick={handleContinue}
                disabled={loading}
              />
            </div>
          </div>

          <div className="col-span-2 flex h-fit flex-col gap-4 rounded-md bg-gray-100 p-8 shadow dark:bg-neutral-800">
            <h1 className="text-md font-bold">{t("after")}</h1>
            <div className="flex gap-4">
              <Newspaper strokeWidth={1} size={20} className={"h-5 w-5"} />
              <div>
                <p className="font-medium text-gray-700 dark:text-white">
                  {t("edit_collection_details")}
                </p>
                <p className={"text-gray-600 dark:text-white"}>
                  {t("can_edit")}
                </p>
              </div>
            </div>
            <h1 className="text-md font-bold">{t("your_community")}</h1>
            <div className="flex gap-4">
              <Eye strokeWidth={1} size={20} className={"h-5 w-5"} />
              <div>
                <p className="font-medium text-gray-700 dark:text-white">
                  {t("can_view")}
                </p>
                <p className={"text-gray-600 dark:text-white"}>
                  {t("deployed_contract")}
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <EyeOff strokeWidth={1} size={20} className={"h-5 w-5"} />
              <div>
                <p className="font-medium text-gray-700 dark:text-white">
                  {t("can_view")}
                </p>
                <p className={"text-gray-600 dark:text-white"}>
                  {t("drop_page_message")}
                </p>
              </div>
            </div>
            <h1 className="text-md font-bold">Platform fee: 2.00%</h1>
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

const splitDescription = (description: string) => {
  return description.split(". ").map((sentence, index) => (
    <p key={index} className="text-md max-w-5xl">
      {sentence.trim() + (sentence.endsWith(".") ? "" : ".")}
    </p>
  ));
};

const DialogContent: React.FC<DialogContentProps> = ({
  title,
  description,
  onClose,
}) => {
  const t = useTranslations("collection");

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold sm:text-3xl">{title}</h1>
      {splitDescription(description)}
      <Button
        onClick={onClose}
        className="bg-gray-200 text-black hover:bg-gray-300 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
      >
        {t("ok")}
      </Button>
    </div>
  );
};
