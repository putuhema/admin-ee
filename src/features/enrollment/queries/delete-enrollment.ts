import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { EnrollementData } from "./use-get-enrollment";

const $delete = client.api.enrollments[":enrollmentId"].$delete;

export const useDeleteEnrollment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      const res = await $delete({
        param: {
          enrollmentId: id.toString(),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete Enrollment");
      }

      toast("Successfully delete enrollment");
      return await res.json();
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({
        queryKey: ["enrollments"],
      });

      const previousEnrollments = queryClient.getQueryData<EnrollementData>([
        "enrollments",
      ]);

      if (previousEnrollments) {
        queryClient.setQueryData(["enrollments"], (old: any) =>
          old.enrollmentId === id
            ? { ...old, optimisticStatus: "deleting" }
            : old,
        );
      }

      return { previousEnrollments };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["enrollments"], context?.previousEnrollments);
    },
    onSettled: (_, __, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["enrollments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["enrollments", id],
      });
    },
  });
};
