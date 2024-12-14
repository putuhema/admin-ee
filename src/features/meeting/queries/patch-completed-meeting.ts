import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { InferRequestType, InferResponseType } from "hono";

const $patch = client.api.meetings["meeting-session"]["completed"]["$patch"];
type Response = InferResponseType<typeof $patch>;
type Request = InferRequestType<typeof $patch>["json"];

export function useCompleteMeeting() {
  const queryClient = useQueryClient();
  const mutation = useMutation<Response, Error, Request>({
    mutationFn: async (data) => {
      const res = await $patch({ json: data });
      if (!res.ok) {
        throw new Error("Failed to update meeting");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({
        queryKey: ["meetings", format(new Date(), "yyyy-MM-dd")],
      });
    },
  });

  return mutation;
}
