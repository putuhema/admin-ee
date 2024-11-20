import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { StudentFilters } from "@/features/students/types";
import { studentKeys } from "./keys";

export type StudentResponse = InferResponseType<
  typeof client.api.students.$get,
  200
>;

export const useGetStudents = (
  limit?: number,
  offset?: number,
  filters?: StudentFilters,
) => {
  return useQuery<StudentResponse, Error>({
    queryKey: studentKeys.lists(limit, offset, filters),
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

        const response = await client.api.students.$get({
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
