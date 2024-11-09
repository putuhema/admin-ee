import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { QUERY_KEY } from "./use-get-pricing";

type RequestType = InferRequestType<
  typeof client.api.subjects.pricing.$post
>["json"];
type ResponseType = InferResponseType<typeof client.api.subjects.pricing.$post>;

export const usePostPricing = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const res = await client.api.subjects.pricing.$post({ json: data });
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
