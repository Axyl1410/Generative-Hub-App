"use client";

import BackButton from "@/components/common/back-button";
import LoadingScreen from "@/components/common/loading-screen";
import ButtonGradiant from "@/components/ui/button-gradiant";
import Dialog from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import useToggle from "@/hooks/use-state-toggle";
import axios from "@/lib/axios-config";
import client, { FORMA_SKETCHPAD } from "@/lib/client";
import { waitForContractDeployment } from "@/lib/waitForContractDeployment";
import { Eye, EyeOff, Info, Newspaper } from "lucide-react";
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { deployERC721Contract } from "thirdweb/deploys";
import { useActiveAccount } from "thirdweb/react";
import { useGenerateDescription } from "@/hooks/use-auto-generate-desc";

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
  const [loading, setLoading] = useState<boolean>(false);
  //  const [isGenerating, setIsGenerating] = useState(false);

  // Toggle hooks
  const logoInfo = useToggle();
  const contractInfo = useToggle();
  const tokenInfo = useToggle();

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
    timeout: 10000, // Tăng timeout vì xử lý ảnh cần thêm thời gian
  });

  // Cập nhật hàm handleGenerateDescription
  const handleGenerateDescription = useCallback(async () => {
    // Các category có sẵn
    const categories = [
      "art",
      "futuristic",
      "mythology",
      "abstract",
      "nature",
      "luxury",
    ];

    // Chọn ngẫu nhiên một category
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];

    try {
      if (!name) {
        toast.warning("Please enter a collection name first");
        return;
      }

      // Gọi generateDescription với name, category và file
      const generatedDescription = await generateDescription(
        name,
        randomCategory,
      );

      if (generatedDescription) {
        // Xóa các markdown tags nếu có
        const cleanDescription = generatedDescription
          .replace(/\*\*/g, "")
          .replace(`${name}: `, "");

        setDescription(cleanDescription);
        toast.success("Description generated successfully!");
      }
    } catch (error) {
      console.error("Error generating description:", error);
      toast.error("Failed to generate description");
    }
  }, [generateDescription, name]); // Thêm files vào dependencies

  // Thêm useCallback và dependencies để tối ưu performance

  const handle = useCallback(async () => {
    if (!account) return;

    setLoading(true);
    try {
      const contractAddress = toast.promise(
        deployERC721Contract({
          chain: FORMA_SKETCHPAD,
          client,
          account: account,
          type: "TokenERC721",
          params: {
            name,
            description,
            symbol,
            image: files ?? undefined,
          },
        }).catch((error) => {
          throw error;
        }),
        {
          loading: "Deploying Collection...",
          success: "Contract deployed successfully",
          error: (error) =>
            `Failed to create collection: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
        }
      );

      await waitForContractDeployment(await contractAddress.unwrap());

      console.log("Contract deployed at:", contractAddress);

      await axios.post("/api/user/add-address", {
        username: account?.address,
        address: contractAddress,
      });

      await axios.post("/api/collection/add-collection", {
        address: contractAddress,
      });
      toast.success("Collection created successfully");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [account, name, description, symbol, files]);

  const handleContinue = useCallback(() => {
    if (!name) {
      toast.warning("Name is required");
      return;
    }
    if (!files) {
      toast.warning("Image is required");
      return;
    }
    handle();
  }, [name, files, handle]);

  // Loading state
  if (isLoading || !account) {
    return <LoadingScreen />;
  }

  return (
    <div className="mt-10 flex w-full justify-center">
      <div className="flex w-full flex-col">
        <BackButton href="/create" className="mb-8 w-fit" />
        <div className="mb-8 flex grid-cols-6 flex-col-reverse gap-12 md:grid">
          <div className="col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-4">
              <h1 className="text-xl font-bold sm:text-3xl">
                Let&#39;s create a smart contract for your drop.
              </h1>
              <p className="text-md">
                You’ll need to deploy an ERC-721 contract onto the blockchain
                before you can create a drop.
                <span className="cursor-not-allowed text-link">
                  What is a contract?
                </span>
              </p>
            </div>
            <div>
              <p className="mb-2 flex items-center font-bold dark:text-text-dark">
                Logo image
                <span className="ml-1 cursor-pointer" onClick={logoInfo.open}>
                  <Info size={16} />
                </span>
              </p>
              <div className="mx-auto rounded-lg border border-dashed border-border bg-white dark:border-neutral-800 dark:bg-black">
                <FileUpload onChange={handleFileUpload} />
              </div>
              <Dialog isOpen={logoInfo.isOpen} onClose={logoInfo.close}>
                <DialogContent
                  title="Logo image"
                  description="Your logo should be a representation of your items and will appear next to your collection name throughout. You can change your logo even after you deploy your contract."
                  onClose={logoInfo.close}
                />
              </Dialog>
            </div>
            <div className="grid gap-4 sm:grid-cols-5">
              <div className="sm:col-span-3">
                <label
                  htmlFor="contract"
                  className="mb-2 flex items-center font-bold dark:text-text-dark"
                >
                  Contract name <span className="text-red-600"> *</span>
                  <span
                    className="ml-1 cursor-pointer"
                    onClick={contractInfo.open}
                  >
                    <Info size={16} />
                  </span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="contract"
                    id="contract"
                    placeholder="My collection name"
                    className="w-full rounded-md bg-background p-[16px] text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"
                    required
                    value={name}
                    onChange={handleNameChange}
                  />
                </div>
                <Dialog
                  isOpen={contractInfo.isOpen}
                  onClose={contractInfo.close}
                >
                  <DialogContent
                    title="Contract name"
                    description="The contract name is the name of your NFT collection, which is visible on chain, this is usually your project or collection name. Contract names cannot be changed after your contract is deployed."
                    onClose={contractInfo.close}
                  />
                </Dialog>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="mcn"
                  className="mb-2 flex items-center font-bold dark:text-text-dark"
                >
                  Token symbol
                  <span
                    className="ml-1 cursor-pointer"
                    onClick={tokenInfo.open}
                  >
                    <Info size={16} />
                  </span>
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    name="mcn"
                    id="mcn"
                    placeholder="MCN"
                    className="w-full rounded-md bg-background p-[16px] text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"
                    value={symbol}
                    readOnly
                  />
                </div>
                <Dialog isOpen={tokenInfo.isOpen} onClose={tokenInfo.close}>
                  <DialogContent
                    title="Token symbol"
                    description="The token symbol is the shorthand way to identify your contract, which is visible on chain. For example, Azuki uses AZUKI and Bored Ape Yacht Club uses BAYC as their respective token symbols, token symbols cannot be changed after your contract is deployed."
                    onClose={tokenInfo.close}
                  />
                </Dialog>
              </div>
            </div>
            <div className="w-full">
              <label
                htmlFor="description"
                className="mb-2 flex items-center font-bold dark:text-text-dark"
              >
                Description<span className="text-red-600"> *</span>
                <button
                  onClick={handleGenerateDescription}
                  disabled={isGenerating || !name}
                  className="ml-2 inline-flex items-center rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-gray-400"
                  type="button"
                >
                  {isGenerating ? (
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      <span className="text-xs">Analyzing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span>✨</span>
                      <span>{"Generate"}</span>
                    </div>
                  )}
                </button>
              </label>
              <div className="mt-2">
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="w-full rounded-md bg-background px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"
                  placeholder="Write a few description about."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {!name && (
                  <p className="mt-1 text-sm text-gray-500">
                    Enter a collection name to generate description
                  </p>
                )}
                {name && !files && (
                  <p className="mt-1 text-sm text-gray-500">
                    Upload an image for enhanced description generation
                  </p>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <ButtonGradiant
                text={loading ? "Loading..." : "🚀 Deploy collection"}
                onClick={handleContinue}
                disabled={loading}
              />
            </div>
          </div>

          <div className="col-span-2 flex h-fit flex-col gap-4 rounded-md bg-gray-100 p-8 shadow dark:bg-neutral-800">
            <h1 className="text-md font-bold">
              After you deploy your contract you’ll be able to:
            </h1>
            <div className="flex gap-4">
              <Newspaper strokeWidth={1} size={20} className={"h-5 w-5"} />
              <div>
                <p className="font-medium text-gray-700 dark:text-white">
                  Manage collection settings
                </p>
                <p className={"text-gray-600 dark:text-white"}>
                  Edit collection details, earnings, and links.
                </p>
              </div>
            </div>
            <h1 className="text-md font-bold">Your community:</h1>
            <div className="flex gap-4">
              <Eye strokeWidth={1} size={20} className={"h-5 w-5"} />
              <div>
                <p className="font-medium text-gray-700 dark:text-white">
                  Can view
                </p>
                <p className={"text-gray-600 dark:text-white"}>
                  That you’ve deployed a contract onto the blockchain.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <EyeOff strokeWidth={1} size={20} className={"h-5 w-5"} />
              <div>
                <p className="font-medium text-gray-700 dark:text-white">
                  Can’t view
                </p>
                <p className={"text-gray-600 dark:text-white"}>
                  Your drop page or items until you publish them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold sm:text-3xl">{title}</h1>
      {splitDescription(description)}
      <button
        onClick={onClose}
        className="rounded-md bg-gray-200 p-4 transition-colors hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600"
      >
        OK
      </button>
    </div>
  );
};
