/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import BackBtn from "@/components/common/back-button";
import ImagePreviewModal from "@/components/common/ImagePreviewModal";
import Loading from "@/components/common/loading";
import LoadingScreen from "@/components/common/loading-screen";
import AttributeInput from "@/components/form/attribute-input";
import AttributeList from "@/components/form/attribute-list";
import CollectionDropdown from "@/components/form/collection-dropdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TransactionDialog, {
  TransactionStep,
} from "@/components/ui/transaction-dialog";
import useAttributes from "@/hooks/use-attributes";
import useAutoFetch from "@/hooks/use-auto-fetch";
import CollectionContract from "@/lib/get-collection-contract";
import { cn } from "@/lib/utils";
import { User } from "@/types";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { mintTo } from "thirdweb/extensions/erc721";
import { TransactionButton, useActiveAccount } from "thirdweb/react";

interface Collection {
  address: string;
  name: string;
}

export default function Page() {
  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;
  const API_URL =
    "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image";

  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [file, setFile] = useState<File | null>(null);

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

  const { data, loading: isLoading } = useAutoFetch<User>(
    `/api/user?username=${account?.address}`,
    600000,
    account?.address
  );

  const t = useTranslations("mint");

  const handleOpenChange = (open: boolean) => {
    if (currentStep === "success" || currentStep === "error") setIsOpen(open);
  };

  const {
    traitType,
    setTraitType,
    attributeValue,
    setAttributeValue,
    attributesArray,
    handleAddAttribute,
    handleRemoveAttribute,
  } = useAttributes();

  useEffect(() => {
    const initialSuggestions = [
      "A futuristic city at sunset",
      "A cute cat astronaut",
      "A cyberpunk street with neon lights",
      "A serene beach with palm trees",
      "A bustling market in Morocco",
      "A tranquil mountain lake",
      "A space station orbiting Earth",
      "A colorful underwater coral reef",
      "A medieval castle on a hill",
      "A vibrant rainforest with exotic animals",
      "A snowy village during Christmas",
      "A desert with towering sand dunes",
    ];
    setSuggestions(initialSuggestions.sort(() => 0.5 - Math.random()));
  }, []);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 100));
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [loading]);

  if (!account || isLoading) return <LoadingScreen />;

  const handleContract = (contract: string) => {
    return CollectionContract(contract);
  };

  async function query() {
    if (!OPENAI_API_KEY) {
      setError("API Key is missing!");
      return;
    }
    if (cooldown > 0) {
      setError(`Too many requests. Please wait ${cooldown} seconds.`);
      return;
    }

    setLoading(true);
    setImageUrl("");
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: prompt, num_images: 1 }), // Generate 1 image
      });

      if (!response.ok) {
        if (response.status === 429) {
          const waitTime = 50;
          setError(`Too many requests. Please wait ${waitTime} seconds.`);
          setCooldown(waitTime);
        } else {
          const errorData = await response.json();
          throw new Error(
            errorData.error?.message ||
              `HTTP Error ${response.status}. Please try again.`
          );
        }
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setImageUrl(url);

      // Convert blob to File object
      const fileName = `generated-image-${Date.now()}.png`;
      const fileFromBlob = new File([blob], fileName, { type: blob.type });
      setFile(fileFromBlob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  function handleNextStep() {
    if (selectedImage) {
      setStep(2);
    } else {
      toast.warning("Please select an image first.");
    }
  }

  return (
    <>
      <div className="flex flex-col-reverse justify-between gap-8 pb-10 md:flex-row md:items-center">
        <h1 className="mt-6 text-2xl font-bold">Generate Image from Text</h1>
        <BackBtn className="mt-6" />
      </div>

      <div className="flex h-full w-full flex-col items-start md:flex-row md:p-6">
        {/* Steps Navigation */}
        <div className="hidden w-full flex-col items-start p-4 md:flex md:w-1/4">
          <h2 className="mb-4 text-xl font-bold">Steps</h2>
          <div
            className={cn(
              "mb-2 cursor-pointer p-2",
              step === 1
                ? "rounded bg-blue-500 font-bold text-white"
                : "rounded bg-gray-200 text-black"
            )}
            onClick={() => setStep(1)}
          >
            1. Generate Image
          </div>
          <div
            className={cn(
              "mb-2 cursor-pointer p-2",
              step === 2 && selectedImage
                ? "rounded bg-blue-500 font-bold text-white"
                : "cursor-not-allowed rounded bg-gray-200 dark:text-black"
            )}
            onClick={() => selectedImage && setStep(2)}
          >
            2. Mint NFT
          </div>
        </div>

        {/* Main Content */}
        <div className="flex w-full flex-col border-gray-200 md:w-3/4 md:border-l md:p-6">
          {step === 1 && (
            <>
              <p className="mb-4 text-gray-600 dark:text-text-dark">
                Enter a prompt and generate an image.
              </p>
              <div className="w-ful flex flex-col gap-6 md:flex-row">
                {/* Input Section */}
                <div className="flex w-full flex-col md:w-1/2">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter prompt..."
                    className="mb-2 h-64 dark:border-white" // Increased height
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={query}
                      disabled={loading || !prompt || cooldown > 0}
                    >
                      {loading ? `Generating... (${cooldown}s)` : "✨ Generate"}
                    </Button>
                    <Button
                      variant="outline"
                      className=""
                      onClick={() => setPrompt("")}
                    >
                      Clear
                    </Button>
                  </div>
                  {error && <p className="mt-2 text-red-500">{error}</p>}
                </div>

                {/* Output Section */}
                <div className="relative flex w-full flex-col items-center rounded border p-4 shadow dark:border-white md:w-1/2">
                  {loading && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-gray-200 bg-opacity-75">
                      <Loading />
                      <div className="mt-4 w-full rounded-full bg-gray-300">
                        <div
                          className="rounded-full bg-blue-500 py-1 text-center text-xs leading-none text-white"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <p className="mt-2">Generating image... {progress}%</p>
                    </div>
                  )}
                  {imageUrl && (
                    <div className="relative mb-4">
                      <img
                        src={imageUrl}
                        alt="Generated"
                        className="h-64 w-64 cursor-pointer rounded object-cover"
                        onClick={() => setSelectedImage(imageUrl)}
                        onDoubleClick={() => {
                          setPreviewImage(imageUrl);
                          setIsPreviewOpen(true);
                        }}
                      />
                      {selectedImage === imageUrl && (
                        <div className="absolute right-0 top-0 rounded-full bg-green-500 p-1">
                          <svg
                            className="h-6 w-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-gray-600 dark:text-white">
                          Click image to select
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setPreviewImage(imageUrl);
                            setIsPreviewOpen(true);
                          }}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m4-3H6"
                            />
                          </svg>
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Add the ImagePreviewModal at the end of your JSX, just before the closing tag */}
                  {isPreviewOpen && (
                    <ImagePreviewModal
                      imageUrl={previewImage}
                      onClose={() => setIsPreviewOpen(false)}
                    />
                  )}
                </div>
              </div>

              <Button
                onClick={handleNextStep}
                disabled={!selectedImage}
                className="mt-4 flex"
              >
                Next: Mint NFT
              </Button>
            </>
          )}

          {step === 2 && selectedImage && (
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
                        contract: handleContract(
                          selectAddress as string
                        ) as any,
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
                    <span>{t("Mint_NFT")}</span>
                  </TransactionButton>
                </div>
              </form>
              <Button
                onClick={() => setStep(1)}
                variant={"destructive"}
                className="mt-4 w-full"
              >
                Back to step 1
              </Button>
            </div>
          )}

          {/* Prompt Suggestion */}
          {step === 1 && (
            <>
              <div className="mt-6">
                <h2 className="text-lg font-semibold">Prompt Suggestions:</h2>
                <div className="mt-4 flex flex-wrap gap-4">
                  {suggestions.slice(0, 5).map((sug) => (
                    <div
                      key={sug}
                      className="break-words rounded bg-white p-2 shadow transition-all hover:bg-accent hover:shadow-lg dark:hover:bg-neutral-300"
                    >
                      <Button
                        variant="ghost"
                        onClick={() => setPrompt(sug)}
                        className="w-auto text-center dark:text-black dark:hover:bg-neutral-300"
                      >
                        {sug}
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-4 size-[14px] w-full"></div>
                <p className="rounded bg-neutral-300 p-2 text-gray-600">
                  📝Note: You can add &#34;v1&#34;, &#34;v2&#34;, etc. at the
                  end of the prompt to generate different images by modifying
                  the prompt like this: &#34;prompt v1&#34;, &#34;prompt
                  v2&#34;, and so on.
                </p>
              </div>
            </>
          )}

          <TransactionDialog
            isOpen={isOpen}
            onOpenChange={handleOpenChange}
            currentStep={currentStep}
            title="Transaction Status"
            message={message}
          />
        </div>
      </div>
    </>
  );
}
