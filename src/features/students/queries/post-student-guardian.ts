import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
const $post = client.api.students["guardian"].$post;
type RequestType = InferRequestType<typeof $post>["json"];
type ResponseType = InferResponseType<typeof $post>;

export const usePostGuardians = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const res = await $post({ json: data });
      if (!res.ok) {
        throw new Error("An error occurred while adding the student");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
      queryClient.invalidateQueries({ queryKey: ["student-guardians"] });
      toast("Successfully added guardian");
    },
  });

  return mutation;
};
