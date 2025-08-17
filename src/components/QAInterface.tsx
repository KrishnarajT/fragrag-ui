import React, { useState } from 'react';
import { Send, Bot, Zap, MessageSquare } from 'lucide-react';
import { apiRequest, API_CONFIG } from '../config/api';
import { useStreamingResponse } from '../hooks/useStreamingResponse';

interface QAInterfaceProps {
  onError: (error: string) => void;
}

const QAInterface: React.FC<QAInterfaceProps> = ({ onError }) => {
  const [question, setQuestion] = useState('');
  const [hasAnswered, setHasAnswered] = useState(false);
  
  const ragStreaming = useStreamingResponse();
  const graphRagStreaming = useStreamingResponse();

  const fallbackRagAnswer = `Traditional RAG Response for "${question}":\n\nBased on the vector similarity search through the document chunks, here's what I found:\n\nThis approach uses dense vector representations to find semantically similar passages from your uploaded document. The retrieval is based on cosine similarity between the question embedding and document chunk embeddings.\n\nKey findings:\n• Direct text matches from relevant document sections\n• Context is limited to the most similar chunks\n• Good for straightforward factual questions\n• May miss complex relationships between entities\n\nThe traditional RAG approach excels at finding direct textual evidence but may struggle with queries requiring understanding of complex relationships or multi-hop reasoning across different parts of the document.`;

  const fallbackGraphRagAnswer = `Graph RAG Response for "${question}":\n\nUsing the knowledge graph representation, here's a more comprehensive analysis:\n\nThis approach leverages the entity-relationship structure extracted from your document, allowing for more sophisticated reasoning about connections between concepts.\n\nGraph-based insights:\n• Identified relevant entities and their relationships\n• Multi-hop reasoning across connected concepts\n• Context from relationship traversal\n• Enhanced understanding of entity dependencies\n• Cross-referenced information from multiple document sections\n\nAdvantages of Graph RAG:\n✓ Better handling of complex, multi-part questions\n✓ Understanding of implicit relationships\n✓ More contextually aware responses\n✓ Ability to synthesize information from disconnected text segments\n\nThe graph-based approach provides richer context by understanding how different pieces of information relate to each other, leading to more nuanced and comprehensive answers.`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setHasAnswered(false);
    ragStreaming.reset();
    graphRagStreaming.reset();

    // Start both API calls simultaneously
    Promise.all([
      // Traditional RAG API call
      ragStreaming.streamResponse(
        () => apiRequest(API_CONFIG.ENDPOINTS.RAG_QUERY, {
          method: 'POST',
          body: JSON.stringify({ question, document_id: 'uploaded_doc' }),
        }),
        {
          fallbackText: fallbackRagAnswer,
          onError: (error) => {
            console.error('RAG API failed:', error);
            onError('Traditional RAG API failed. Using demo response.');
          },
        }
      ),
      
      // Graph RAG API call
      graphRagStreaming.streamResponse(
        () => apiRequest(API_CONFIG.ENDPOINTS.GRAPH_RAG_QUERY, {
          method: 'POST',
          body: JSON.stringify({ question, document_id: 'uploaded_doc' }),
        }),
        {
          fallbackText: fallbackGraphRagAnswer,
          onError: (error) => {
            console.error('Graph RAG API failed:', error);
            onError('Graph RAG API failed. Using demo response.');
          },
        }
      ),
    ]).finally(() => {
      setHasAnswered(true);
    });
  };

  const isLoading = ragStreaming.isStreaming || graphRagStreaming.isStreaming;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Q&A Interface</h2>
        <p className="text-gray-600">
          Ask questions about your document and compare responses from traditional RAG vs Graph RAG
        </p>
      </div>

      {/* Question Input */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-3">
            Enter your question:
          </label>
          <div className="flex space-x-4">
            <textarea
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask any question about your uploaded document..."
              className="flex-1 min-h-[100px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !question.trim()}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Loading State */}
      {(ragStreaming.isStreaming || graphRagStreaming.isStreaming) && !hasAnswered && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-3 text-blue-600">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-lg font-medium">Generating responses from both systems...</span>
          </div>
        </div>
      )}

      {/* Answer Comparison */}
      {(hasAnswered || ragStreaming.streamedText || graphRagStreaming.streamedText) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Traditional RAG */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-orange-50 px-6 py-4 border-b border-orange-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-orange-600" />
                </div>
                <h3 className="font-semibold text-orange-900">Traditional RAG</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {ragStreaming.streamedText}
                  {ragStreaming.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-orange-600 animate-pulse ml-1"></span>
                  )}
                </pre>
              </div>
            </div>
          </div>

          {/* Graph RAG */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-green-50 px-6 py-4 border-b border-green-200">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Zap className="h-4 w-4 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900">Graph RAG</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 max-h-[500px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                  {graphRagStreaming.streamedText}
                  {graphRagStreaming.isStreaming && (
                    <span className="inline-block w-2 h-4 bg-green-600 animate-pulse ml-1"></span>
                  )}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Questions */}
      {!hasAnswered && !ragStreaming.streamedText && !graphRagStreaming.streamedText && (
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-4 flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Try these sample questions:</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "What are the main concepts discussed in the document?",
              "How are different entities related to each other?",
              "Summarize the key findings from the research?",
              "What methodology was used in this study?"
            ].map((sampleQ, index) => (
              <button
                key={index}
                onClick={() => setQuestion(sampleQ)}
                className="text-left p-3 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-blue-800 text-sm"
              >
                {sampleQ}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QAInterface;