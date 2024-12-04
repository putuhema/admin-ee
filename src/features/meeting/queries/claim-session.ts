import { InferResponseType, InferRequestType } from "hono";
import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";

const $post = client.api.meetings["claim-session"]["$post"];
type Response = InferResponseType<typeof $post, 200>;
type Request = InferRequestType<typeof $post>["json"];

export function useClaimSession() {
  const queryClient = useQueryClient();
  return useMutation<Response, Error, Request>({
    mutationFn: async (body) => {
      const res = await $post({ json: body });
      if (!res.ok) {
        throw new Error("Failed to claim session");
      }

      const data = await res.json();
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
      queryClient.invalidateQueries({
        queryKey: ["meetings", format(new Date(), "yyyy-MM-dd")],
      });
    },
  });
}
