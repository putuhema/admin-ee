import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { StudentsResponseData } from "./use-post-students";
import { useStudentFiltersStore } from "../store";
import { studentKeys } from "./keys";

const $delete = client.api.students[":studentId"].$delete;
type StudentResponseData = InferResponseType<typeof $delete, 200> & {
  optimisticStatus?: "creating" | "updating" | "deleting";
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  const { appliedFilters, limit, offset } = useStudentFiltersStore();
  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const res = await $delete({
        param: {
          studentId: id.toString(),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete Student");
      }

      toast("Successfully delete student");
      return await res.json();
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: studentKeys.lists(limit, offset, appliedFilters),
      });

      const previousStudents = queryClient.getQueryData<StudentsResponseData[]>(
        studentKeys.lists(limit, offset, appliedFilters),
      );

      if (previousStudents) {
        queryClient.setQueryData(
          studentKeys.lists(limit, offset, appliedFilters),
          (old: any) => (old: any) => ({
            ...old,
            students: old.tasks.map((student: StudentsResponseData) =>
              student.id === id
                ? { ...student, optimisticStatus: "deleting" }
                : student,
            ),
          }),
        );
      }

      const previousStudent = queryClient.getQueryData<StudentResponseData>(
        studentKeys.detail(id),
      );

      if (previousStudent) {
        queryClient.setQueryData(["student", id], (old: any) => {
          return {
            ...old,
            isDeleted: true,
            deletedAt: new Date(),
            optimisticStatus: "deleting",
          };
        });
      }

      return { previousStudents };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        studentKeys.lists(limit, offset, appliedFilters),
        context?.previousStudents,
      );
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: studentKeys.detail(id) });
      queryClient.invalidateQueries({
        queryKey: studentKeys.lists(limit, offset, appliedFilters),
      });
    },
  });
};
