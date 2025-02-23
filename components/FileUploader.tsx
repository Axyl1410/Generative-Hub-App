"use client";

import { RefreshCw } from "lucide-react"; // Add this import
import { useRef, useState } from "react";

interface FileUploaderProps {
  onSuccess?: (url: string, folderId: string) => void;
  onError?: (error: string) => void;
}

export default function FileUploader({
  onSuccess,
  onError,
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Upload failed");
      }

      if (data.url) {
        // Convert the URL to use the static API route
        const staticUrl = data.url.replace("/uploads/", "/api/static/");
        setHtmlContent(staticUrl);
        onSuccess?.(staticUrl, data.folderId);
      } else {
        throw new Error("Không thể tải lên file ZIP");
      }
    } catch (error) {
      console.error("Lỗi upload file:", error);
      onError?.(
        error instanceof Error ? error.message : "Lỗi khi tải lên file ZIP"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept=".zip"
        onChange={handleFileUpload}
        disabled={isUploading}
        className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-violet-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-violet-700 hover:file:bg-violet-100 disabled:opacity-50"
      />
      {isUploading && (
        <div className="mt-2 text-sm text-gray-500">Đang tải lên...</div>
      )}
      {htmlContent && (
        <div className="relative">
          <iframe
            ref={iframeRef}
            src={`${htmlContent}?refresh=${refreshKey}`}
            width="400"
            height="400"
            onLoad={() => console.log("Sketch loaded")}
          ></iframe>
          <button
            onClick={handleRefresh}
            className="absolute right-2 top-2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
            title="Refresh sketch"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
