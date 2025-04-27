import React, { useState, useEffect } from 'react';
import { Highlighter } from 'lucide-react';

function App() {
  const [highlights, setHighlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadHighlights();
  }, []);

  const loadHighlights = async () => {
    try {
      const result = await chrome.storage.local.get(['highlights']);
      setHighlights(result.highlights || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading highlights:', error);
      setIsLoading(false);
    }
  };

  const deleteHighlight = async (id) => {
    try {
      const updatedHighlights = highlights.filter(h => h.id !== id);
      await chrome.storage.local.set({ highlights: updatedHighlights });
      setHighlights(updatedHighlights);
    } catch (error) {
      console.error('Error deleting highlight:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return `Today, ${date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
      <Highlighter className="w-12 h-12 mb-4 opacity-50" />
      <p className="text-lg mb-2">No highlights saved yet</p>
      <p className="text-sm opacity-70">Select text on any webpage and click "Save Highlight" to begin</p>
    </div>
  );

  return (
    <div className="w-[360px] h-[480px] bg-white dark:bg-gray-900">
      <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h1 className="flex items-center gap-2 text-lg font-semibold">
          <Highlighter className="w-5 h-5 text-indigo-600" />
          Text Highlighter
        </h1>
      </header>

      <div className="h-[calc(480px-64px)] overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : highlights.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-4">
            {highlights.map(highlight => (
              <div
                key={highlight.id}
                className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 group relative"
              >
                <p className="text-sm text-gray-800 dark:text-gray-200 mb-3">
                  {highlight.text}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <a
                    href={highlight.pageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 truncate max-w-[200px]"
                  >
                    {highlight.pageTitle}
                  </a>
                  <span>{formatDate(highlight.timestamp)}</span>
                </div>
                <button
                  onClick={() => deleteHighlight(highlight.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;