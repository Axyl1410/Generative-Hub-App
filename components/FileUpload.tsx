"use client";

import { useEffect, useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target?.result;

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        const data = await response.json();
        setUserId(data.userId);
        alert("File updated successfully");
      } else {
        alert("Error updating file");
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (userId) {
      const script = document.createElement("script");
      script.src = `/sketch-${userId}.js`;
      script.async = true;
      document.getElementById("sketch-container")?.appendChild(script);
    }
  }, [userId]);

  return (
    <div>
      <input type="file" accept=".js" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {userId && (
        <div
          id="sketch-container"
          style={{ width: "100%", height: "600px" }}
        ></div>
      )}
    </div>
  );
};

export default FileUpload;
