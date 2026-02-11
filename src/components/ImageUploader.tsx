// Reusable image upload component — used by logo upload and project image upload
import { useState, useRef } from "react";
import { validateImage } from "../lib/r2ImageUpload";

interface ImageUploaderProps {
  label: string;
  currentUrl?: string;
  onFileSelected: (file: File) => void;
  onRemove?: () => void;
  disabled?: boolean;
}

export function ImageUploader({
  label,
  currentUrl,
  onFileSelected,
  onRemove,
  disabled,
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError.message);
      return;
    }

    setError(null);
    setPreview(URL.createObjectURL(file));
    onFileSelected(file);
  };

  const displayUrl = preview ?? currentUrl;

  return (
    <div className="image-uploader">
      <label>{label}</label>

      {displayUrl && (
        <div className="image-preview">
          <img src={displayUrl} alt="Preview" />
        </div>
      )}

      <div className="image-uploader-actions">
        <button
          type="button"
          className="btn secondary btn-sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
        >
          {displayUrl ? "Change" : "Choose image"}
        </button>

        {displayUrl && onRemove && (
          <button
            type="button"
            className="btn secondary btn-sm"
            onClick={() => {
              setPreview(null);
              setError(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
              onRemove();
            }}
            disabled={disabled}
          >
            Remove
          </button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <p className="hint">PNG, JPEG, or WebP. Max 2 MB.</p>
      {error && <p className="image-upload-error">{error}</p>}
    </div>
  );
}
