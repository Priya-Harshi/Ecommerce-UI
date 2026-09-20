import { useState } from "react";
import "./BulkUpload.css";

const API_URL = "https://localhost:7042/api/Product/bulk-upload";

function BulkUpload() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select an Excel file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data || "Upload failed.");
      }

      setMessage(data);
      setFile(null);

      // Reset file input
      e.target.reset();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="bulk-upload-page">
      <div className="bulk-upload-header">
        <div>
          <h1>Bulk Product Upload</h1>
          <p>Add multiple products to your store using an Excel file.</p>
        </div>
      </div>

      {message && <div className="bulk-message">{message}</div>}

      <div className="bulk-upload-card">
        <div className="bulk-icon">📤</div>

        <h2>Upload Excel File</h2>

        <p className="bulk-description">
          Select an Excel file containing your product information and upload it
          to add products in bulk.
        </p>

        <form onSubmit={handleUpload}>
          <label className="file-upload-area">
            <span className="file-upload-icon">📁</span>

            <span className="file-upload-title">
              {file ? file.name : "Choose an Excel file"}
            </span>

            <span className="file-upload-subtitle">
              {file
                ? "File selected successfully"
                : "Only .xlsx files are supported"}
            </span>

            <input
              type="file"
              accept=".xlsx"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </label>

          {file && (
            <div className="selected-file">
              <span>📄</span>

              <div>
                <strong>{file.name}</strong>
                <small>{(file.size / 1024).toFixed(1)} KB</small>
              </div>
            </div>
          )}

          <button type="submit" className="upload-button" disabled={!file}>
            📤 Upload Excel
          </button>
        </form>
      </div>

      <div className="bulk-info">
        <h3>Excel File Requirements</h3>

        <div className="requirements">
          <div className="requirement">
            <span>✓</span>
            <p>
              Upload files in <strong>.xlsx</strong> format.
            </p>
          </div>

          <div className="requirement">
            <span>✓</span>
            <p>
              Make sure the Excel file contains the required product columns.
            </p>
          </div>

          <div className="requirement">
            <span>✓</span>
            <p>Invalid product data will be reported by the system.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkUpload;
