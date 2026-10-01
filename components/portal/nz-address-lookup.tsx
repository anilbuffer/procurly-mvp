"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  MapPin,
  Search,
  CheckCircle2,
  Sparkles,
  Loader2,
  X,
  ExternalLink,
  ChevronDown,
  Building2,
  Navigation,
} from "lucide-react";
import {
  lookupNZAddress,
  NZAddressSuggestion,
  isValidNZPostcode,
  CURATED_NZ_ADDRESSES,
} from "@/lib/nz-address-service";

export interface NZAddressSelected {
  streetAddress: string;
  suburb: string;
  city: string;
  postalCode: string;
  fullAddress: string;
  isVerified: boolean;
  source?: string;
  dpId?: string;
}

interface NZAddressLookupProps {
  onSelectAddress: (addr: NZAddressSelected) => void;
  initialValue?: string;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export function NZAddressLookup({
  onSelectAddress,
  initialValue = "",
  placeholder = "Start typing NZ street number, road or suburb (e.g. 34 Great South Rd)...",
  label = "New Zealand Address Lookup (NZ Post / Address Autocomplete)",
  required = false,
  className = "",
}: NZAddressLookupProps) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<NZAddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedResult, setSelectedResult] = useState<NZAddressSelected | null>(null);
  const [showManualToggle, setShowManualToggle] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync initial value if provided
  useEffect(() => {
    if (initialValue && !query) {
      setQuery(initialValue);
    }
  }, [initialValue]);

  // Handle outside clicks to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Perform search with debounce
  const performSearch = useCallback((searchTerm: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (searchTerm.trim().length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await lookupNZAddress(searchTerm, { maxResults: 6 });
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setSelectedIndex(-1);
      } catch (err) {
        console.error("NZ Address Lookup Error:", err);
      } finally {
        setIsLoading(false);
      }
    }, 200);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedResult(null);
    performSearch(val);
  };

  const handleSelectSuggestion = (item: NZAddressSuggestion) => {
    const selected: NZAddressSelected = {
      streetAddress: item.streetAddress,
      suburb: item.suburb,
      city: item.city,
      postalCode: item.postalCode,
      fullAddress: item.fullAddress,
      isVerified: item.isVerified,
      source: item.source,
      dpId: item.dpId,
    };

    setQuery(item.fullAddress);
    setSelectedResult(selected);
    setIsOpen(false);
    setSuggestions([]);
    onSelectAddress(selected);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setIsOpen(false);
    setSelectedResult(null);
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "ArrowDown" && query.length >= 2) {
        performSearch(query);
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && selectedIndex >= 0 && selectedIndex < suggestions.length) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#FE0000]" />
            <span>{label}</span>
            {required && <span className="text-[#FE0000]">*</span>}
          </label>
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              NZ Post / Address Finder
            </span>
          </div>
        </div>
      )}

      {/* Main Search Input */}
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none flex items-center gap-1.5">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#FE0000]" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
            else if (query.trim().length >= 2) performSearch(query);
          }}
          placeholder={placeholder}
          className="w-full pl-9 pr-20 py-2.5 bg-slate-50 hover:bg-white focus:bg-white text-xs text-slate-900 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FE0000]/20 focus:border-[#FE0000] transition-all shadow-xs"
        />

        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          <span className="px-1.5 py-0.5 text-[9px] font-bold  text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
            NZ
          </span>
        </div>
      </div>

      {/* Dropdown Suggestions List */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="px-3 py-1.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
            <span>Matching NZ Postal Addresses ({suggestions.length})</span>
            <span className="text-slate-400">Press ↑↓ to navigate, Enter to select</span>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {suggestions.map((item, idx) => {
              const isHighlighted = idx === selectedIndex;
              return (
                <div
                  key={item.id || idx}
                  onClick={() => handleSelectSuggestion(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3.5 py-2.5 cursor-pointer flex items-start justify-between gap-3 text-xs transition-colors ${isHighlighted ? "bg-red-50/60 text-slate-900" : "hover:bg-slate-50/80 text-slate-700"
                    }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isHighlighted ? "bg-[#FE0000] text-white" : "bg-slate-100 text-slate-500"
                        }`}
                    >
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{item.streetAddress}</p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.suburb ? `${item.suburb}, ` : ""}
                        {item.city} {item.postalCode ? `• Postcode: ${item.postalCode}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 gap-1">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                      {item.source}
                    </span>
                    {item.postalCode && (
                      <span className="text-[9px]  font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-2 bg-slate-50/70 border-t border-slate-100 text-center">
            <span className="text-[10px] text-slate-400">
              Powered by official New Zealand Post & LINZ Geospatial Data Service
            </span>
          </div>
        </div>
      )}

      {/* Selected Address Confirmation Banner */}
      {selectedResult && (
        <div className="mt-2.5 p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 flex items-start justify-between gap-3 text-xs text-emerald-950 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-emerald-900">NZ Post Verified Address</span>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded">
                  {selectedResult.source || "Official NZ Post"}
                </span>
              </div>
              <p className="font-medium text-emerald-800 mt-0.5 leading-snug">
                {selectedResult.streetAddress}, {selectedResult.suburb ? `${selectedResult.suburb}, ` : ""}
                {selectedResult.city} {selectedResult.postalCode}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setSelectedResult(null)}
            className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline shrink-0"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
