import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { bookPrepKeys } from "./keys";
import { BookPrepFilter } from "../types";

const $get = client.api["book-preparations"]["$get"];
export type BookPreparationData = InferResponseType<typeof $get, 200>;

export const useGetBookPreps = (
  limit?: number,
  offset?: number,
  filters?: BookPrepFilter,
) => {
  return useQuery<BookPreparationData, Error>({
    queryKey: bookPrepKeys.lists(limit, offset, filters),
    queryFn: async () => {
      try {
        const queryParams: Record<string, string | undefined> = {
          limit: limit?.toString(),
          offset: offset?.toString(),
        };

        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) {
              queryParams[key] = value;
            }
          });
        }

        const response = await $get({
          query: queryParams,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        return data;
      } catch (error) {
        throw new Error("Failed to fetch students");
      }
    },
  });
};
