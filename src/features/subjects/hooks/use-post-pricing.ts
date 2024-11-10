import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { QUERY_KEY } from "./use-get-pricing";

const $put = client.api.subjects["subject-pricing"]["$put"];
type RequestType = InferRequestType<typeof $put>["json"];
type ResponseType = InferResponseType<typeof $put>;

export const usePostSubjectPricing = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const res = await $put({ json: data });
      if (!res.ok) {
        throw new Error("Failed to add subject pricing");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      toast("Pricing added successfully");
    },
    onError: (error) => {
      toast(error.message);
    },
  });

  return mutation;
};
