import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { StudentsResponseData } from "./use-post-students";
import { useStudentFiltersStore } from "../store";
import { studentKeys } from "./keys";

const $patch = client.api.students[":studentId"]["$patch"];
type RequestType = InferRequestType<typeof $patch>["json"];
type StudentResponseData = InferResponseType<typeof $patch, 200> & {
  optimisticStatus?: "creating" | "updating" | "deleting";
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
  const { appliedFilters, limit, offset } = useStudentFiltersStore();

  const mutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: RequestType }) => {
      const res = await $patch({
        json: data,
        param: {
          studentId: id.toString(),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to update Student");
      }

      toast("Successfully updated student");
      return await res.json();
    },
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: studentKeys.lists(limit, offset, appliedFilters),
      });

      const previousStudents = queryClient.getQueryData<StudentsResponseData[]>(
        ["students"],
      );
      const previousStudent = queryClient.getQueryData<StudentResponseData>([
        "student",
        id,
      ]);

      if (previousStudents) {
        queryClient.setQueryData(
          studentKeys.lists(limit, offset, appliedFilters),
          (old: any) => ({
            ...old,
            students: old.tasks.map((s: StudentsResponseData) =>
              s.id === id ? { ...s, ...data, optimisticStatus: "updating" } : s,
            ),
          }),
        );
      }

      if (previousStudent) {
        queryClient.setQueryData(studentKeys.detail(id), (old: any) => {
          return {
            ...old,
            ...data,
            optimisticStatus: "updating",
          };
        });
      }

      return { previousStudents, previousStudent };
    },
    onError: (_, { id }, context) => {
      queryClient.setQueryData(
        studentKeys.detail(id),
        context?.previousStudent,
      );
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

  return mutation;
};
