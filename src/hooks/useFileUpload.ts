import { useState } from "react";
import { getAllFiles, getSignedURL, deleteFile } from "../actions";
import { computeCheckSUM256, validateFile } from "../utils";
import type { FileItem } from "../types";

export const useFileUpload = () => {
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [previewFileType, setPreviewFileType] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<FileItem[]>([]);

  const handleFileUpload = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      setLoading(true);

      const form = e.target as HTMLFormElement;
      const fileInput = form.querySelector(
        'input[name="file"]'
      ) as HTMLInputElement | null;
      const file = fileInput?.files?.[0];

      if (!file) {
        setError("Please select a file to upload.");
        return;
      }

      const validation = validateFile(file);
      if (!validation.isValid) {
        setError(validation.error!);
        return;
      }

      setError("");

      const checksum = await computeCheckSUM256(file);

      const { success, url, message } = await getSignedURL(
        file.size,
        file.type,
        checksum
      );

      if (!success) {
        setError(message);
        return;
      }

      const data = await fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-type": file.type,
        },
      });

      if (data.ok) {
        await loadFiles();
        // Reset form
        form.reset();
        setPreviewUrl("");
        setPreviewFileType("");
      }
    } catch (error) {
      console.log(error);
      setError("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async () => {
    try {
      const res = await getAllFiles();
      setImages(res.files || []);
    } catch (error) {
      console.log(error);
      setError("Failed to load files.");
    }
  };

  const handleDeleteFile = async (url: string) => {
    try {
      const fileName = url.split("/").pop()!;
      const result = await deleteFile(fileName);
      
      if (result.success) {
        await loadFiles();
      } else {
        setError("Failed to delete file.");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to delete file.");
    }
  };

  const handleFileChange = (file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPreviewFileType(file.type);
    } else {
      setPreviewUrl("");
      setPreviewFileType("");
    }
  };

  return {
    previewUrl,
    previewFileType,
    error,
    loading,
    images,
    handleFileUpload,
    loadFiles,
    handleDeleteFile,
    handleFileChange,
    setError,
  };
};
