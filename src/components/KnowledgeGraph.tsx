import React from 'react';
import { Brain, Zap, Network } from 'lucide-react';

const KnowledgeGraph: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Knowledge Graph Visualization</h2>
        <p className="text-gray-600">
          Interactive visualization of entities and relationships extracted from your documents
        </p>
      </div>

      {/* Graph Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Network className="h-5 w-5 text-gray-600" />
              <h3 className="font-semibold text-gray-900">Neo4j Graph Database</h3>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Entities</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Relationships</span>
              </span>
            </div>
          </div>
        </div>

        {/* Graph Visualization Area */}
        <div className="relative aspect-[16/10] bg-gradient-to-br from-gray-900 to-gray-800">
          <img
            src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Knowledge Graph Visualization"
            className="w-full h-full object-cover opacity-80"
          />
          
          {/* Overlay content */}
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
            <div className="text-center text-white p-8">
              <Brain className="h-16 w-16 mx-auto mb-4 text-blue-400" />
              <h3 className="text-2xl font-bold mb-2">Graph Visualization Loading...</h3>
              <p className="text-blue-200 mb-6 max-w-md">
                Your knowledge graph is being processed. This visualization will be replaced with 
                an interactive Neo4j iframe in the production version.
              </p>
              <div className="inline-flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-lg">
                <Zap className="h-4 w-4" />
                <span className="text-sm font-medium">Processing entities and relationships</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Network className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">247</p>
              <p className="text-sm text-gray-500">Nodes</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">1,432</p>
              <p className="text-sm text-gray-500">Relationships</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">89%</p>
              <p className="text-sm text-gray-500">Accuracy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Graph Information */}
      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="font-semibold text-amber-900 mb-3">Development Note:</h3>
        <p className="text-amber-800">
          This placeholder visualization will be replaced with an interactive Neo4j graph visualization 
          in the production version. The graph will show entities, relationships, and allow for 
          interactive exploration of the knowledge extracted from your documents.
        </p>
      </div>
    </div>
  );
};

export default KnowledgeGraph;