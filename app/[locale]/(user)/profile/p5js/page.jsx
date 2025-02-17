"use client";

import { useRef, useState } from "react";

const P5ArtCreator = () => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const previewRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => setCode(event.target.result);
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

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      // Write content to iframe
      iframeDoc.open();
      iframeDoc.write(`
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
      iframeDoc.close();

      // Error handling
      const errorHandler = (event) => {
        if (event.data?.type === "p5-error") {
          setError(event.data.message);
          window.removeEventListener("message", errorHandler);
        }
      };
      window.addEventListener("message", errorHandler);
    } catch (e) {
      console.error("Lỗi khi chạy mã:", e);
      setError("System error! Please again.");
    }
  };

  const handleDownload = (format) => {
    const iframe = previewRef.current?.querySelector("iframe");
    if (!iframe) return;

    const canvas = iframe.contentDocument?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `p5_art.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  };

  return (
    <div className="container">
      <h1>P5.js Art Creator</h1>

      <div className="upload-section">
        <input
          type="file"
          accept=".js"
          onChange={handleFileUpload}
          className="file-input"
        />
      </div>

      <div className="preview-container">
        <h2>Preview</h2>
        {error && (
          <div className="error-message">
            <h3>Error: </h3>
            <pre>{error}</pre>
          </div>
        )}
        <div ref={previewRef} className="preview-canvas"></div>
      </div>

      <div className="code-editor">
        <h2>Source code</h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-textarea"
          placeholder="Enter your p5.js code here..."
        />
      </div>

      <button onClick={runCode} className="run-button">
        Run code
      </button>

      <div className="download-buttons">
        <button
          onClick={() => handleDownload("png")}
          className="download-button"
        >
          Download PNG
        </button>
        <button
          onClick={() => handleDownload("jpg")}
          className="download-button"
        >
          Download JPG
        </button>
        <button
          onClick={() => handleDownload("gif")}
          className="download-button"
        >
          Download GIF
        </button>
      </div>
    </div>
  );
};

export default P5ArtCreator;
