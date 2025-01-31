"use client";
import Loading from "@/components/common/loading";
import { useState, useEffect } from "react";

export default function Page() {
    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_HF_API_KEY;
    const API_URL = "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image"; 

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
            }, 5000);
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
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ "inputs": prompt }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                if (response.status === 429) {
                    const waitTime = 50; // Thời gian cooldown (giây)
                    setError(`Too many requests. Please wait ${waitTime} seconds.`);
                    setCooldown(waitTime);
                } else {
                    throw new Error(errorData.error?.message || `HTTP Error ${response.status}`);
                }
                return;
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setImageUrl(imageUrl);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center p-4 text-base ">
            <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter prompt..."
                className="border p-2 rounded w-full max-w-md bg-background px-3 py-1.5 text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 dark:bg-background-dark dark:text-white sm:text-sm/6"
            />
            <button
                onClick={query}
                disabled={loading || !prompt || cooldown > 0}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
            >
                {loading ? "Generating..." : "Generate Image"}
            </button>

            {loading && <p className="mt-4"><Loading/></p>}

            {/* Hiển thị lỗi hoặc thời gian cooldown */}
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {cooldown > 0 && <p className="mt-2 text-gray-600">Retry in {cooldown} seconds...</p>}

            {/* Hiển thị ảnh và nút "Generate Again" */}
            {imageUrl && (
                <div className="mt-4 flex flex-col items-center">
                    <img src={imageUrl} alt="Generated" className="w-64 h-64 object-cover rounded" />
                   
                    <span className="mt-3 w text-gray-600 border p-3 rounded bg-gray-300">📝Note: You can add "v1", "v2", etc. at the end of the prompt to generate different images by modifying the prompt like this: "prompt v1", "prompt v2", and so on.</span>
                </div>
            )}
        </div>
    );
}
