"use client";

import React, { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { SearchIcon, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useStudentFiltersStore } from "../store";

const DEBOUNCE_DELAY = 500;

export const StudentSearch = () => {
  const [search, setSearch] = useState<string>("");

  const { setSearch: setSearchStore } = useStudentFiltersStore();

  const debouncedSearch = useDebounce(search, DEBOUNCE_DELAY);

  useEffect(() => {
    setSearchStore(debouncedSearch);
  }, [debouncedSearch, setSearchStore]);

  const handleClearSearch = () => {
    setSearch("");
    const searchInput = document.querySelector<HTMLInputElement>(
      '[name="student-search"]',
    );
    searchInput?.focus();
  };

  return (
    <div
      className="relative flex w-full items-center gap-2 md:max-w-md"
      role="search"
      aria-label="Search Students"
    >
      <SearchIcon
        className="absolute left-4 h-4 w-4 text-gray-500"
        aria-hidden="true"
      />

      <Input
        name="student-search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full pl-10 pr-10"
        placeholder="Search students"
        aria-label="Search students"
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
