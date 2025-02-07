"use client";

import BackButton from "@/components/common/back-button";
import Loading from "@/components/common/loading";
import ButtonGradiant from "@/components/ui/button-gradiant";
import Dialog from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import useToggle from "@/hooks/use-state-toggle";
import axios from "@/lib/axios-config";
import client, { FORMA_SKETCHPAD } from "@/lib/client";
import { Eye, EyeOff, Info, Newspaper } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import { deployERC721Contract } from "thirdweb/deploys";
import { useActiveAccount } from "thirdweb/react";

interface DialogContentProps {
  title: string;
  description: string;
  onClose: () => void;
}

export default function Page() {
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [files, setFiles] = useState<File>();
  const handleFileUpload = (files: File) => setFiles(files);

  const logoInfo = useToggle();
  const contractInfo = useToggle();
  const tokenInfo = useToggle();
  const account = useActiveAccount();

  if (!account) return <Loading />;

  const handle = async () => {
    try {
      const contractAddress = await deployERC721Contract({
        chain: FORMA_SKETCHPAD,
        client,
        account: account,
        type: "TokenERC721",
        params: {
          name,
          description,
          symbol,
          image: files,
        },
      });

      console.log("Contract deployed at:", contractAddress);
      toast("Contract deployed successfully");

      await Promise.all([
        axios.post("/api/user/add-address", {
          username: account?.address,
          address: contractAddress,
        }),
        axios.post("/api/add-collection", {
          address: contractAddress,
        }),
      ]);

      toast("Collection created successfully");
    } catch (error) {
      toast.error("Failed to create collection" + error);
    }
  };

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
                  Contract name
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
                    className="w-full rounded-md bg-background px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
              <div className={"sm:col-span-2"}>
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
                    className="w-full rounded-md bg-background px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"
                    required
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
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
                Description
              </label>
              <div className="mt-2">
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="w-full rounded-md bg-background px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"
                  required
                  placeholder="Write a few description about."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
            <ButtonGradiant text="Continue" onClick={handle} />
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
