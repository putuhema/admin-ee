import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

const $delete = client.api.meetings.$delete;
type Response = InferResponseType<typeof $delete>;
type Request = InferRequestType<typeof $delete>["json"];

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  const mutation = useMutation<Response, Error, Request>({
    mutationFn: async (data) => {
      const res = await $delete({ json: data });
      if (!res.ok) {
        throw new Error("Failed to delete meeting");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({ queryKey: ["schedule"] });
    },
  });

  return mutation;
}
