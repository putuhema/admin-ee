import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useStudentFiltersStore } from "../store";
import { studentKeys } from "./keys";
import { Student } from "../types";

const $post = client.api.students["bulk-delete"]["$post"];
type RequestType = InferRequestType<typeof $post>["json"];

export const useBulkDeleteStudents = () => {
  const queryClient = useQueryClient();
  const { appliedFilters, limit, offset } = useStudentFiltersStore();

  return useMutation({
    mutationFn: async (ids: number[]) => {
      const res = await $post({
        json: {
          ids,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete Students");
      }

      toast("Successfully delete student");
      return await res.json();
    },
    onMutate: async (ids) => {
      await queryClient.cancelQueries({
        queryKey: studentKeys.lists(limit, offset, appliedFilters),
      });

      const previousStudents = queryClient.getQueryData<Student[]>(
        studentKeys.lists(limit, offset, appliedFilters),
      );

      if (previousStudents) {
        queryClient.setQueryData(
          studentKeys.lists(limit, offset, appliedFilters),
          (old: any) => ({
            ...old,
            students: old.students.map((s: Student) =>
              ids.includes(s.id) ? { ...s, optimisticStatus: "deleting" } : s,
            ),
          }),
        );
      }

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
};
