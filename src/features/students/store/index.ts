import { create } from "zustand";
import { SortingState } from "@tanstack/react-table";

import { StudentFiltersState } from "@/features/students/types/filters";
import { StudentFilters } from "@/features/students/types";
import { DEFAULT_PAGE_SIZE } from "@/constants";

interface StudentFiltersStoreState {
  filter: StudentFiltersState;
  appliedFilters: StudentFilters;
  limit?: number;
  offset?: number;
  sorting?: SortingState;
  setFilter: (filter: StudentFiltersState) => void;
  setSearch: (search: string) => void;
  setLimit: (limit: number) => void;
  setOffset: (offset: number) => void;
  clearFilters: () => void;
}

export const useStudentFiltersStore = create<StudentFiltersStoreState>(
  (set, get) => ({
    limit: DEFAULT_PAGE_SIZE,
    offset: 0,
    appliedFilters: {
      search: "",
      sort: undefined,
      order: undefined,
    },
    filter: {
      search: "",
    },
    setFilter: (filter: StudentFiltersState) => {
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

    setSearch: (search?: string) => {
      const currentFilter = get().filter;
      const currentAppliedFilters = get().appliedFilters;

      set({
        filter: { ...currentFilter, search },
        appliedFilters: { ...currentAppliedFilters, search },
      });
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
  }),
);
