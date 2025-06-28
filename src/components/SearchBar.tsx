import React, { useState, useEffect, useRef } from 'react';
import { WeatherIcons } from '../utils/weatherIcons';
import { allLocations } from '../data/indianLocations';
import { LocationSuggestion } from '../types/weather';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onLocationRequest: () => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationRequest, isLoading }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const isNumeric = /^\d+$/.test(query);
      
      let filtered: LocationSuggestion[] = [];
      
      if (isNumeric && query.length >= 3) {
        // Search by pincode
        filtered = allLocations.filter(location => 
          location.pincode && location.pincode.startsWith(query)
        );
      } else {
        // Search by name, region, or country
        filtered = allLocations.filter(location => 
          location.name.toLowerCase().includes(query.toLowerCase()) ||
          location.region.toLowerCase().includes(query.toLowerCase()) ||
          location.country.toLowerCase().includes(query.toLowerCase()) ||
          (location.pincode && location.pincode.includes(query))
        );
      }
      
      // Sort results: exact matches first, then by type (cities, towns, villages)
      filtered.sort((a, b) => {
        const aExact = a.name.toLowerCase() === query.toLowerCase();
        const bExact = b.name.toLowerCase() === query.toLowerCase();
        
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        const typeOrder = { city: 0, town: 1, district: 2, village: 3 };
        return typeOrder[a.type] - typeOrder[b.type];
      });
      
      setSuggestions(filtered.slice(0, 12)); // Show up to 12 suggestions
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
      setSelectedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion: LocationSuggestion) => {
    setQuery(suggestion.name);
    onSearch(suggestion.name);
    setShowSuggestions(false);
    setSelectedIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else if (query.trim()) {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'city':
        return '🏙️';
      case 'town':
        return '🏘️';
      case 'village':
        return '🏡';
      case 'district':
        return '🗺️';
      default:
        return '📍';
    }
  };

  const isNumeric = /^\d+$/.test(query);

  return (
    <div className="w-full max-w-2xl mx-auto mb-8" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <WeatherIcons.Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.length >= 2) {
                setShowSuggestions(true);
              }
            }}
            placeholder="Search by city, town, village name or pincode (e.g., Mumbai, 400001, Manali)..."
            className="w-full pl-12 pr-20 py-4 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-300"
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onLocationRequest}
            disabled={isLoading}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 disabled:opacity-50"
            title="Use current location"
          >
            {isLoading ? (
              <WeatherIcons.Loader className="w-5 h-5 text-white animate-spin" />
            ) : (
              <WeatherIcons.MapPin className="w-5 h-5 text-white" />
            )}
          </button>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl z-50 overflow-hidden max-h-96 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <button
                key={`${suggestion.name}-${suggestion.region}-${suggestion.country}-${suggestion.pincode}`}
                type="button"
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full text-left px-4 py-3 hover:bg-white/20 transition-all duration-200 border-b border-white/10 last:border-b-0 ${
                  index === selectedIndex ? 'bg-white/20' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg flex-shrink-0">
                    {getLocationTypeIcon(suggestion.type)}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">{suggestion.name}</span>
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {suggestion.type}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center space-x-2">
                      <span>{suggestion.region}, {suggestion.country}</span>
                      {suggestion.pincode && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                            {suggestion.pincode}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </form>

      {/* Search Tips */}
      {query.length > 0 && query.length < 2 && (
        <div className="mt-2 text-center">
          <p className="text-white/60 text-sm">
            Type at least 2 characters to see suggestions
          </p>
        </div>
      )}

      {/* Pincode search tip */}
      {isNumeric && query.length >= 3 && query.length < 6 && (
        <div className="mt-2 text-center">
          <p className="text-white/60 text-sm">
            🔢 Searching by pincode... Type full 6-digit pincode for best results
          </p>
        </div>
      )}

      {/* No results message */}
      {query.length >= 2 && suggestions.length === 0 && (
        <div className="mt-2 text-center">
          <p className="text-white/60 text-sm">
            {isNumeric ? 
              `No locations found for pincode "${query}". Try major pincodes like 400001 (Mumbai), 110001 (Delhi), 560001 (Bangalore)` :
              `No locations found matching "${query}". Try searching for major cities, towns, or villages like Mumbai, Manali, Goa, etc.`
            }
          </p>
        </div>
      )}

      {/* Search examples */}
      {query.length === 0 && (
        <div className="mt-3 text-center">
          <p className="text-white/50 text-xs mb-2">Try searching for:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Mumbai', 'Manali', 'Goa', '400001', 'Kerala', 'Rajasthan'].map((example) => (
              <button
                key={example}
                onClick={() => setQuery(example)}
                className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-white/70 text-xs transition-all duration-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;