import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

const $post = client.api.invoices.$post;
type Response = InferResponseType<typeof $post, 200>;
type Request = InferRequestType<typeof $post>["json"];

export function useCreateInvoices() {
  const queryClient = useQueryClient();
  return useMutation<Response, Error, Request>({
    mutationFn: async (formData) => {
      const res = await $post({ json: formData });

      if (!res.ok) {
        throw new Error("Failed to create invoices");
      }

      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
  });
}
