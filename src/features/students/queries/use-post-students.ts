import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { studentKeys } from "./keys";
import { useStudentFiltersStore } from "../store";

type RequestType = InferRequestType<typeof client.api.students.$post>["json"];
export type StudentsResponseData = InferResponseType<
  typeof client.api.students.$post,
  200
> & {
  optimisticStatus?: "creating" | "updating" | "deleting";
};

export const usePostStudents = () => {
  const queryClient = useQueryClient();
  const { appliedFilters, limit, offset } = useStudentFiltersStore();

  const mutation = useMutation({
    mutationFn: async (data: RequestType) => {
      const res = await client.api.students.$post({ json: data });

      if (!res.ok) {
        throw new Error("Failed to add student");
      }

      toast("Student added successfully");
      return await res.json();
    },
    onMutate: async (data) => {
      await queryClient.cancelQueries({
        queryKey: studentKeys.lists(limit, offset, appliedFilters),
      });
      const previousStudents = queryClient.getQueryData<StudentsResponseData[]>(
        ["students"],
      );

      queryClient.setQueryData(
        studentKeys.lists(limit, offset, appliedFilters),
        (old: any) => {
          const id = Math.floor(Math.random() * old.length * 1_000);
          return {
            ...old,
            students: [
              {
                ...data,
                id,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                optimisticStatus: "creating",
              },
              ...(old?.students || []),
            ],
          };
        },
      );

      return { previousStudents };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        studentKeys.lists(limit, offset, appliedFilters),
        context?.previousStudents,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(limit, offset, appliedFilters),
      });
    },
  });

  return mutation;
};
