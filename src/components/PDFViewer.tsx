import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';

interface PDFViewerProps {
  file: File | null;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
  const pdfUrl = file ? URL.createObjectURL(file) : null;

  if (!file) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Document Uploaded</h3>
          <p className="text-gray-500 mb-6">
            Please upload a PDF document in the first tab to view it here.
          </p>
          <div className="inline-flex items-center space-x-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
            <Eye className="h-4 w-4" />
            <span className="text-sm font-medium">Waiting for document upload</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Document Viewer</h2>
        <p className="text-gray-600">
          Review your uploaded document before proceeding with analysis
        </p>
      </div>

      {/* Document Info */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">{file.name}</h3>
              <p className="text-sm text-gray-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-900">PDF Viewer</h3>
        </div>
        
        <div className="relative">
          {pdfUrl && (
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-[800px] border-0"
              title="PDF Viewer"
            />
          )}
        </div>
      </div>

      {/* Viewer Information */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Document Processing:</h3>
        <ul className="space-y-2 text-blue-800">
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>Text extraction and chunking completed</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>Vector embeddings generated for traditional RAG</span>
          </li>
          <li className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
            <span>Knowledge graph entities and relationships extracted</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PDFViewer;