import type { ValidationResult } from "../types";

export const computeCheckSUM256 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

export const validateFile = (file: File): ValidationResult => {
  const maxSizeMB = 10;
  if (file.size > maxSizeMB * 1024 * 1024) {
    return {
      isValid: false,
      error: `File size should not exceed ${maxSizeMB}MB.`,
    };
  }

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/ogg",
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: "Unsupported file type.",
    };
  }

  return { isValid: true };
};
