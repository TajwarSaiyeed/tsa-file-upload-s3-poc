import React from "react";
import type { FileItem } from "../types";

interface GalleryProps {
  images: FileItem[];
  onRefresh: () => Promise<void>;
  onDeleteFile: (url: string) => Promise<void>;
}

const Gallery: React.FC<GalleryProps> = ({ images, onRefresh, onDeleteFile }) => {
    console.log(images);
    
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          <span className="mr-3">🖼️</span>
          Your Gallery
        </h2>
        <button
          onClick={onRefresh}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-md hover:shadow-lg transform hover:scale-105"
        >
          🔄 Refresh Gallery
        </button>
      </div>

      {images.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-4">📭</div>
          <p className="text-lg">No files uploaded yet</p>
          <p className="text-sm">Upload your first file to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {images.map((image) => (
            <div key={image.key} className="group relative">
              <img
                src={image.url}
                alt="Uploaded content"
                className="w-full h-24 object-cover rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group-hover:scale-105 cursor-pointer"
              />
              <button
                onClick={() => onDeleteFile(image.url)}
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-bold shadow-lg"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gallery;
