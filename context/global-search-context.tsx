"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type SearchCategory = "all" | "invoices" | "quotes" | "parts" | "references";

interface GlobalSearchContextType {
  isOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeCategory: SearchCategory;
  setActiveCategory: (category: SearchCategory) => void;
  openSearch: (options?: { category?: SearchCategory; query?: string }) => void;
  closeSearch: () => void;
  toggleSearch: () => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextType | undefined>(undefined);

export function GlobalSearchProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");

  const openSearch = useCallback((options?: { category?: SearchCategory; query?: string }) => {
    if (options?.category) {
      setActiveCategory(options.category);
    }
    if (options?.query !== undefined) {
      setSearchQuery(options.query);
    }
    setIsOpen(true);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  // Global keyboard shortcut: Cmd+K / Ctrl+K & Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to toggle search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <GlobalSearchContext.Provider
      value={{
        isOpen,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        openSearch,
        closeSearch,
        toggleSearch,
      }}
    >
      {children}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const context = useContext(GlobalSearchContext);
  if (!context) {
    throw new Error("useGlobalSearch must be used within a GlobalSearchProvider");
  }
  return context;
}
