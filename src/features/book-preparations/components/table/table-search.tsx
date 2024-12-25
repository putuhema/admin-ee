"use client";

import React, { useState } from "react";
import { SearchIcon, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useBookPrepFiltersStore } from "../../hooks/useFilterBookPrep";

export const TableSearch = () => {
  const [search, setSearch] = useState<string>("");

  const { setValue: setSearchStore, appliedFilters } =
    useBookPrepFiltersStore();

  const handleClearSearch = () => {
    setSearch("");
    const searchInput = document.querySelector<HTMLInputElement>(
      '[name="book-preparations-search"]'
    );
    searchInput?.focus();
  };

  return (
    <div
      className="relative flex w-full items-center gap-2 md:max-w-md"
      role="search"
      aria-label="Search Book Preparations"
    >
      <SearchIcon
        className="absolute left-4 h-4 w-4 text-gray-500"
        aria-hidden="true"
      />

      <Input
        name="book-preparations-search"
        value={appliedFilters.search}
        onChange={(e) => setSearchStore("search", e.target.value)}
        className="w-full pl-10 pr-10"
        placeholder="Search book preparations"
        aria-label="Search book preparations"
        autoComplete="off"
      />

      {search && (
        <button
          type="button"
          onClick={handleClearSearch}
          className="absolute right-4 flex h-4 w-4 items-center justify-center"
          aria-label="Clear search"
        >
          <X
            className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700"
            aria-hidden="true"
          />
        </button>
      )}
    </div>
  );
};
