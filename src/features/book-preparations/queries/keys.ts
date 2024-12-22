import { BookPrepFilter } from "@/features/book-preparations/types";

export const bookPrepKeys = {
  all: ["book-preparations"] as const,
  lists: (limit?: number, offset?: number, filters?: BookPrepFilter) =>
    [...bookPrepKeys.all, "list", limit, offset, filters] as const,
  detail: (id: number) => [...bookPrepKeys.all, "detail", id] as const,
};
