import React, { useState, useCallback } from 'react';
import { Upload, File, CheckCircle } from 'lucide-react';
import { apiRequest, API_CONFIG } from '../config/api';

interface DocumentUploadProps {
  onFileUpload: (file: File) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('document', file);
      formData.append('filename', file.name);

      // Simulate progress while making API call
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) return prev; // Stop at 90% until API completes
          return prev + Math.random() * 10;
        });
      }, 200);

      // Make API call
      const response = await apiRequest(API_CONFIG.ENDPOINTS.UPLOAD_DOCUMENT, {
        method: 'POST',
        body: formData,
        headers: {}, // Remove Content-Type to let browser set it for FormData
      });

      const result = await response.json();
      
      // Complete progress
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsUploading(false);
      onFileUpload(file);
      
      console.log('Upload successful:', result);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError('Upload failed. Please try again.');
      
      // Simulate successful upload for demo purposes
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);
            onFileUpload(file);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);
    }
  }, [onFileUpload]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      handleFileUpload(file);
    }
  }, [handleFileUpload]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Upload PDF Documents</h2>
        <p className="text-gray-600">
          Upload your PDF documents to begin the RAG vs Graph RAG comparison analysis
        </p>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          
          <div>
            <p className="text-xl font-medium text-gray-900">
              Drop your PDF files here, or{' '}
              <label className="text-blue-600 hover:text-blue-500 cursor-pointer underline">
                browse
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </label>
            </p>
            <p className="text-gray-500 mt-2">PDF files up to 10MB are supported</p>
          </div>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="mt-6">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="flex items-center space-x-4">
              <File className="h-8 w-8 text-blue-600 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{uploadedFile?.name}</p>
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {Math.round(uploadProgress)}% complete
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Success */}
      {uploadedFile && uploadProgress === 100 && !isUploading && !uploadError && (
        <div className="mt-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-8 w-8 text-green-600 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-900">Upload Successful</h3>
                <p className="text-green-700">{uploadedFile.name} has been processed successfully</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Error */}
      {uploadError && (
        <div className="mt-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Upload className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-medium text-yellow-900">API Connection Failed</h3>
                <p className="text-yellow-700">
                  {uploadError} Using demo mode - all features will work with sample data.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Next Steps:</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>After upload, view the generated knowledge graph in the next tab</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>Browse your document in the Document Viewer tab</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>Test queries in the Q&A Interface to compare RAG approaches</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentUpload;