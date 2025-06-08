import React from "react";

interface FilePreviewProps {
  previewUrl: string;
  fileType?: string;
}

const FilePreview: React.FC<FilePreviewProps> = ({ previewUrl, fileType }) => {
  if (!previewUrl) return null;

  // Check if it's a video based on file type or URL
  const isVideo = fileType ? 
    fileType.startsWith('video/') : 
    (previewUrl.match(/\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i) || 
     previewUrl.includes('video'));

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span className="mr-3">👁️</span>
        Preview
      </h3>
      <div className="bg-gray-50 rounded-xl p-6 flex justify-center">
        {isVideo ? (
          <video
            src={previewUrl}
            controls
            className="max-w-md max-h-64 rounded-lg shadow-lg"
          />
        ) : (
          <img
            src={previewUrl}
            alt="Preview"
            className="max-w-md max-h-64 object-contain rounded-lg shadow-lg"
          />
        )}
      </div>
    </div>
  );
};

export default FilePreview;
