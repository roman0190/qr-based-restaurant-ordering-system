"use client";

import React, { useCallback, useRef, useState } from "react";
import { Button } from "./button";
import { UploadCloud, Trash2, Image as ImageIcon } from "lucide-react";

export default function ImageUpload({
  currentUrl,
  onUploaded,
  onRemoved,
}: {
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
  onRemoved?: () => void;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const uploadBase64 = useCallback((dataUrl: string, filename: string) => {
    return new Promise<string>((resolve, reject) => {
      setUploading(true);
      setProgress(0);
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/upload");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable)
          setProgress(Math.round((e.loaded / e.total) * 100));
      };
      xhr.onload = () => {
        setUploading(false);
        try {
          const json = JSON.parse(xhr.responseText);
          if (json.ok) resolve(json.url);
          else reject(new Error(json.error || "upload failed"));
        } catch (err) {
          reject(err);
        }
      };
      xhr.onerror = () => {
        setUploading(false);
        reject(new Error("Upload error"));
      };
      xhr.send(JSON.stringify({ filename, data: dataUrl }));
    });
  }, []);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      // client-side validations
      const allowed = ["image/png", "image/jpeg", "image/webp"];
      if (!allowed.includes(file.type))
        return alert("Only PNG, JPG or WEBP allowed");
      if (file.size > 10 * 1024 * 1024) return alert("Max file size is 10MB");

      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = String(reader.result);
        setPreview(dataUrl);
        try {
          const url = await uploadBase64(dataUrl, file.name);
          setPreview(url);
          onUploaded(url);
        } catch (err) {
          alert((err as Error).message);
        }
      };
      reader.readAsDataURL(file);
    },
    [onUploaded, uploadBase64]
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleFile(f);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    handleFile(f);
  };

  const remove = () => {
    setPreview(null);
    onRemoved?.();
  };

  return (
    <div>
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed rounded p-4 flex items-center gap-4"
      >
        <div className="w-20 h-20 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
          {preview ? (
            <img
              src={preview}
              className="w-full h-full object-cover"
              alt="preview"
            />
          ) : (
            <ImageIcon className="text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              onChange={onChange}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
            >
              <UploadCloud size={16} /> Upload
            </Button>
            {preview && (
              <Button variant="ghost" size="sm" onClick={remove}>
                <Trash2 size={16} /> Remove
              </Button>
            )}
          </div>
          {uploading && (
            <div className="mt-2 w-full bg-gray-100 rounded h-2 overflow-hidden">
              <div
                className="h-2 bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">
            PNG, JPG, WEBP — max 10MB
          </div>
        </div>
      </div>
    </div>
  );
}
