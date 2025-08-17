import React, { useState } from 'react';
import Navbar from './components/Navbar';
import DocumentUpload from './components/DocumentUpload';
import KnowledgeGraph from './components/KnowledgeGraph';
import PDFViewer from './components/PDFViewer';
import QAInterface from './components/QAInterface';
import ErrorNotification from './components/ErrorNotification';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return <DocumentUpload onFileUpload={setUploadedFile} />;
      case 'graph':
        return <KnowledgeGraph />;
      case 'pdf':
        return <PDFViewer file={uploadedFile} />;
      case 'qa':
        return <QAInterface onError={setError} />;
      default:
        return <DocumentUpload onFileUpload={setUploadedFile} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            RAG vs Graph RAG Comparison
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compare traditional Retrieval Augmented Generation with Graph-based RAG 
            to understand the differences in knowledge representation and retrieval
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg">
          <div className="p-6 min-h-[600px]">
            {renderTabContent()}
          </div>
        </div>
      </div>
      
      {/* Error Notification */}
      {error && (
        <ErrorNotification
          message={error}
          onClose={() => setError(null)}
        />
      )}
    </div>
  );
}

export default App;