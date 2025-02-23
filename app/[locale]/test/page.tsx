"use client";

import FileUploader from "@/components/FileUploader";

export default function Home() {
  const handleUploadSuccess = (url: string, folderId: string) => {
    console.log("Upload successful:", { url, folderId });
  };

  const handleUploadError = (error: string) => {
    console.error("Upload failed:", error);
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">File Uploader</h1>
      <FileUploader
        onSuccess={handleUploadSuccess}
        onError={handleUploadError}
      />
    </main>
  );
}
