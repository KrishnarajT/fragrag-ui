import { useState, useCallback } from 'react';

interface StreamingOptions {
  onComplete?: (fullText: string) => void;
  onError?: (error: Error) => void;
  simulateStreaming?: boolean;
  fallbackText?: string;
}

export const useStreamingResponse = () => {
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState('');

  const simulateTextStreaming = useCallback((text: string, onComplete?: (text: string) => void) => {
    setIsStreaming(true);
    setStreamedText('');
    
    const words = text.split(' ');
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setStreamedText(prev => prev + (currentIndex === 0 ? '' : ' ') + words[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsStreaming(false);
        onComplete?.(text);
      }
    }, 50); // Stream words every 50ms
    
    return () => clearInterval(interval);
  }, []);

  const streamResponse = useCallback(async (
    apiCall: () => Promise<Response>,
    options: StreamingOptions = {}
  ) => {
    const { onComplete, onError, simulateStreaming = true, fallbackText = '' } = options;
    
    try {
      setIsStreaming(true);
      setStreamedText('');
      
      const response = await apiCall();
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Check if response supports streaming
      if (response.body && response.headers.get('content-type')?.includes('text/stream')) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            setStreamedText(prev => prev + chunk);
          }
          
          setIsStreaming(false);
          onComplete?.(streamedText);
        } finally {
          reader.releaseLock();
        }
      } else {
        // Regular JSON response
        const text = await response.text();
        if (simulateStreaming) {
          simulateTextStreaming(text, onComplete);
        } else {
          setStreamedText(text);
          setIsStreaming(false);
          onComplete?.(text);
        }
      }
    } catch (error) {
      setIsStreaming(false);
      onError?.(error as Error);
      
      // Fall back to simulated streaming with fallback text
      if (fallbackText && simulateStreaming) {
        setTimeout(() => {
          simulateTextStreaming(fallbackText, onComplete);
        }, 500);
      }
    }
  }, [simulateTextStreaming, streamedText]);

  const reset = useCallback(() => {
    setIsStreaming(false);
    setStreamedText('');
  }, []);

  return {
    isStreaming,
    streamedText,
    streamResponse,
    simulateTextStreaming,
    reset,
  };
};