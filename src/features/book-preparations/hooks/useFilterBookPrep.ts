import { create } from "zustand";
import { SortingState } from "@tanstack/react-table";

import { DEFAULT_PAGE_SIZE } from "@/constants";
import { BookPrepFilter } from "../types";
import { BookPrepFiltersState } from "../types/filters";

interface BookPrepFiltersStoreState {
  filter: BookPrepFiltersState;
  appliedFilters: BookPrepFilter;
  limit?: number;
  offset?: number;
  sorting?: SortingState;
  setFilter: (filter: BookPrepFiltersState) => void;
  setValue: (key: keyof BookPrepFiltersState, value: string) => void;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
  clearFilters: () => void;
}

export const useBookPrepFiltersStore = create<BookPrepFiltersStoreState>(
  (set, get) => ({
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
    appliedFilters: {
      search: "",
      program: "",
      status: "",
      sort: undefined,
      order: undefined,
    },
    filter: {
      search: "",
      program: "",
      status: "",
    },
    setFilter: (filter: BookPrepFiltersState) => {
      const currentFilter = get().filter;
      const currentAppliedFilters = get().appliedFilters;
      const newFilter = { ...currentFilter, ...filter };

      const appliedFilters = {
        search: currentAppliedFilters?.search,
        sort: currentAppliedFilters?.sort,
        order: currentAppliedFilters?.order,
      };

      set({ filter: newFilter, appliedFilters });
    },
    setValue: (key: keyof BookPrepFiltersState, value: string) => {
      const currentFilter = get().filter;
      const currentAppliedFilters = get().appliedFilters;
      const newFilter = { ...currentFilter, [key]: value };

      const appliedFilters = {
        ...currentAppliedFilters,
        [key]: value,
      };

      set({ filter: newFilter, appliedFilters });
    },
    setLimit: (limit?: number) => set({ limit }),
    setOffset: (offset?: number) => set({ offset }),
    clearFilters: () =>
      set({
        filter: {
          search: "",
        },
        appliedFilters: {
          search: "",
        },
      }),
  })
);
