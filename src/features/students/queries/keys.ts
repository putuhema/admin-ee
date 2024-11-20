import { StudentFilters } from "@/features/students/types";

export const studentKeys = {
  all: ["students"] as const,
  lists: (limit?: number, offset?: number, filters?: StudentFilters) =>
    [...studentKeys.all, "list", limit, offset, filters] as const,
  detail: (id: number) => [...studentKeys.all, "detail", id] as const,
};
