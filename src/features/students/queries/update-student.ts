import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { StudentsResponseData } from "./use-post-students";

const $patch = client.api.students[":studentId"]["$patch"];
type RequestType = InferRequestType<typeof $patch>["json"];
type StudentResponseData = InferResponseType<typeof $patch, 200> & {
  optimisticStatus?: "creating" | "updating" | "deleting";
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();
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
      await queryClient.cancelQueries({ queryKey: ["students"] });

      const previousStudents = queryClient.getQueryData<StudentsResponseData[]>(
        ["students"],
      );
      const previousStudent = queryClient.getQueryData<StudentResponseData>([
        "student",
        id,
      ]);

      if (previousStudents) {
        queryClient.setQueryData(["students"], (old: any) => {
          return old.map((student: any) => {
            if (student.id === id) {
              return {
                ...student,
                ...data,
                optimisticStatus: "updating",
              };
            }
            return student;
          });
        });
      }

      if (previousStudent) {
        queryClient.setQueryData(["student", id], (old: any) => {
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
      queryClient.setQueryData(["student", id], context?.previousStudent);
      queryClient.setQueryData(["students"], context?.previousStudents);
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["student", id] });
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  return mutation;
};
