"use client";

import Loading from "@/components/common/loading";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function Page() {
  const OPENAI_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;
  const API_URL =
    "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image";

  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0); // Thời gian cooldown (giây)

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          const newCooldown = prev > 0 ? prev - 1 : 0;
          if (newCooldown === 0) {
            setError(""); // Tắt lỗi khi hết thời gian chờ
          }
          return newCooldown;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

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
        body: JSON.stringify({ inputs: prompt, n: 5 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 429) {
          const waitTime = 50; // Thời gian cooldown (giây)
          setError(`Too many requests. Please wait ${waitTime} seconds.`);
          setCooldown(waitTime);
        } else {
          throw new Error(
            errorData.error?.message || `HTTP Error ${response.status}`
          );
        }
        const t = useTranslations("generateimg");
        return;
      }

      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setImageUrl(imageUrl);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  function t(arg0: string): import("react").ReactNode {
    throw new Error("Function not implemented.");
  }

  return (
    <form className="flex flex-col items-center p-4 text-base">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter prompt..."
        className="w-full max-w-md rounded border bg-background p-2 px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"
      />
      <motion.button
        onClick={query}
        disabled={loading || !prompt || cooldown > 0}
        layout
        style={{ width: "auto" }}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Image"}
      </motion.button>

      {loading && (
        <div className="mt-4">
          <Loading />
        </div>
      )}

      {/* Hiển thị lỗi hoặc thời gian cooldown */}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {cooldown > 0 && (
        <p className="mt-2 text-gray-600">
          {t("Retry _in")} {cooldown} {t("seconds")}
        </p>
      )}

      {/* Hiển thị ảnh và nút "Generate Again" */}
      {imageUrl && (
        <div className="mt-4 flex flex-col items-center">
          <img
            src={imageUrl}
            alt="Generated"
            className="h-64 w-64 rounded object-cover"
          />

          <span className="w mt-3 rounded border bg-gray-300 p-3 text-gray-600">
            {t("You_can_add")} &#34;v1&#34;, &#34;v2&#34; {t("etc")}
            {t("the_prompt")}
            {t("this")} &#34;{t("prompt_v1")} &#34;, &#34;{t("prompt_v2")}&#34;{" "}
            {t("and_so")}
          </span>
        </div>
      )}
    </form>
  );
}
