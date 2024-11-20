import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";

type RequestType = InferRequestType<typeof client.api.students.$post>["json"];
export type StudentsResponseData = InferResponseType<
  typeof client.api.students.$post,
  200
> & {
  optimisticStatus?: "creating" | "updating" | "deleting";
};

export const usePostStudents = () => {
  const queryClient = useQueryClient();
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
      await queryClient.cancelQueries({ queryKey: ["students"] });
      const previousStudents = queryClient.getQueryData<StudentsResponseData[]>(
        ["students"],
      );

      queryClient.setQueryData(["students"], (old: any) => {
        const id = Math.floor(Math.random() * old.length * 1_000);
        return [
          ...old,
          {
            ...data,
            id,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            optimisticStatus: "creating",
          },
        ];
      });

      return { previousStudents };
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["students"], context?.previousStudents);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  return mutation;
};
