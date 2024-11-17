import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const $post = client.api.meetings.$post;
type Response = InferResponseType<typeof $post>;
type Request = InferRequestType<typeof $post>["json"];

export function usePostSchedule() {
  const queryClient = useQueryClient();
  const mutation = useMutation<Response, Error, Request>({
    mutationFn: async (data) => {
      const res = await $post({ json: data });
      if (!res.ok) {
        throw new Error("Failed to post meeting");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
      toast.success("Add new Schedule");
    },
  });

  return mutation;
}
