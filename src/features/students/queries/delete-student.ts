import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { StudentsResponseData } from "./use-post-students";

const $delete = client.api.students[":studentId"].$delete;
type StudentResponseData = InferResponseType<typeof $delete, 200> & {
  optimisticStatus?: "creating" | "updating" | "deleting";
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();
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
      await queryClient.cancelQueries({ queryKey: ["students"] });

      const previousStudents = queryClient.getQueryData<StudentsResponseData[]>(
        ["students"],
      );

      if (previousStudents) {
        queryClient.setQueryData(["students"], (old: any) =>
          old.filter((student: any) => student.id !== id),
        );
      }

      const previousStudent = queryClient.getQueryData<StudentResponseData>([
        "student",
        id,
      ]);

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
      queryClient.setQueryData(["students"], context?.previousStudents);
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });
};
