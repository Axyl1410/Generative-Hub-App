"use client";

import { useRef, useState, ChangeEvent } from "react";
import styles from "@/styles/p5-art-creator.module.scss";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

const P5ArtCreator: React.FC = () => {
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setCode(event.target?.result as string);
    reader.readAsText(file);
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

  const handleDownload = (format: string) => {
    const iframe = previewRef.current?.querySelector("iframe");
    if (!iframe) return;

    const canvas = iframe.contentDocument?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `p5_art.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  };
  const t = useTranslations("pjs");
  return (
    <div className={styles.container}>
      <h1>{t("p5")} </h1>

      <div className={styles.uploadSection}>
        <input
          type="file"
          accept=".js"
          onChange={handleFileUpload}
          className={styles.fileInput}
        />
      </div>

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
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={styles.codeTextarea}
          placeholder="Enter your p5.js code here..."
        />
      </div>

      <button onClick={runCode} className={styles.runButton}>
        {t("Run_code")}
      </button>

      <div className={styles.downloadButtons}>
        <button
          onClick={() => handleDownload("png")}
          className={styles.downloadButton}
        >
          {t("Download_PNG")}
        </button>
        <button
          onClick={() => handleDownload("jpg")}
          className={styles.downloadButton}
        >
          {t("Download_JPG")}
        </button>
        <button
          onClick={() => handleDownload("gif")}
          className={styles.downloadButton}
        >
          {t("Download_GIF")}
        </button>
      </div>
    </div>
  );
};

export default P5ArtCreator;
