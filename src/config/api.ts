// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_REACT_APP_API_BASE_URL || 'https://your-backend-api.com/api',
  ENDPOINTS: {
    UPLOAD_DOCUMENT: '/documents/upload',
    RAG_QUERY: '/rag/query',
    GRAPH_RAG_QUERY: '/graph-rag/query',
  },
  TIMEOUT: 30000, // 30 seconds
};

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...defaultOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};