// Global Search Component
// Provides comprehensive search across all content types

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchService, SearchResult } from '../services/search-service';

interface GlobalSearchProps {
  embedded?: boolean;
  onResultSelect?: (result: SearchResult) => void;
  defaultFilters?: {
    contentTypes?: string[];
    dateRange?: string;
  };
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({
  embedded = false,
  onResultSelect,
  defaultFilters
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const searchResults = await searchService.searchContent({
        query,
        contentTypes: defaultFilters?.contentTypes || ['story', 'media', 'analysis'],
        limit: 10
      });
      
      setResults(searchResults);
      setShowResults(true);
    } catch (error) {
      console.error('Search failed:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    setShowResults(false);
    setQuery('');
  };

  return (
    <div className={`relative ${embedded ? 'w-full' : 'max-w-md'}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search content, stories, media..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
        />
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.id}
              onClick={() => handleResultClick(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{result.title}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{result.excerpt}</p>
                </div>
                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  {result.type}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {showResults && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
          No results found for "{query}"
        </div>
      )}
    </div>
  );
};