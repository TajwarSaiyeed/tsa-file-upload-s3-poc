import React, { useEffect } from "react";
import { Layout, Header, FileUpload, FilePreview, Gallery } from "./components";
import { useFileUpload } from "./hooks";

const App: React.FC = () => {
  const {
    previewUrl,
    previewFileType,
    error,
    loading,
    images,
    handleFileUpload,
    loadFiles,
    handleDeleteFile,
    handleFileChange,
  } = useFileUpload();

  useEffect(() => {
    loadFiles();
  }, []);

  return (
    <Layout>
      <Header />
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <FileUpload
          onSubmit={handleFileUpload}
          loading={loading}
          error={error}
          onFileChange={handleFileChange}
        />
        
        <FilePreview previewUrl={previewUrl} fileType={previewFileType} />
      </div>

      <Gallery
        images={images}
        onRefresh={loadFiles}
        onDeleteFile={handleDeleteFile}
      />
    </Layout>
  );
};

export default App;
