export interface FileItem {
  key: string | undefined;
  lastModified: Date | undefined;
  size: number | undefined;
  url: string;
  type: any;
}

export interface S3Response {
  success: boolean;
  url?: string;
  message: string;
  files?: FileItem[];
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}
