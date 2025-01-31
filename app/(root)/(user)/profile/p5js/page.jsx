"use client";
import { useState, useEffect, useRef } from "react";

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
        setError("Vui lòng nhập mã p5.js");
        return;
      }

      if (!previewRef.current) {
        setError("Không tìm thấy khu vực hiển thị!");
        return;
      }

      // Clear previous content
      previewRef.current.innerHTML = '';

      // Create new iframe
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '400px';
      iframe.style.border = 'none';
      previewRef.current.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

      // Write content to iframe
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.js"></script>
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
        if (event.data?.type === 'p5-error') {
          setError(event.data.message);
          window.removeEventListener('message', errorHandler);
        }
      };
      window.addEventListener('message', errorHandler);

    } catch (e) {
      console.error("Lỗi khi chạy mã:", e);
      setError("Lỗi hệ thống! Vui lòng thử lại.");
    }
  };

  const handleDownload = (format) => {
    const iframe = previewRef.current?.querySelector('iframe');
    if (!iframe) return;

    const canvas = iframe.contentDocument?.querySelector('canvas');
    if (!canvas) return;

    const link = document.createElement('a');
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
            <h3>Lỗi:</h3>
            <pre>{error}</pre>
          </div>
        )}
        <div ref={previewRef} className="preview-canvas"></div>
      </div>

      <div className="code-editor">
        <h2>Mã nguồn</h2>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="code-textarea"
          placeholder="Nhập mã p5.js của bạn ở đây..."
        />
      </div>

      <button onClick={runCode} className="run-button">Chạy Mã</button>

      <div className="download-buttons">
        <button onClick={() => handleDownload("png")} className="download-button">Tải PNG</button>
        <button onClick={() => handleDownload("jpg")} className="download-button">Tải JPG</button>
        <button onClick={() => handleDownload("gif")} className="download-button">Tải GIF</button>
      </div>

      <style jsx>{`
        .container {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }
        .file-input {
          margin: 20px 0;
        }
        .preview-container {
          margin: 20px 0;
          border: 2px solid #ccc;
          padding: 15px;
        }
        .code-textarea {
          width: 100%;
          height: 300px;
          font-family: monospace;
          padding: 10px;
          margin: 10px 0;
        }
        .run-button {
          background: #28a745;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 5px;
          margin: 10px 0;
        }
        .download-buttons {
          display: flex;
          gap: 10px;
        }
        .download-button {
          background: #0070f3;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          border-radius: 5px;
        }
        .error-message {
          color: #ff0000;
          background: #ffecec;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
        }
      `}</style>
    </div>
  );
};

export default P5ArtCreator;
