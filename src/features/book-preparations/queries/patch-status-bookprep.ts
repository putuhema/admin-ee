import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { bookPrepKeys } from "./keys";
import { toast } from "sonner";

const $patch = client.api["book-preparations"]["status"]["$patch"];

type Response = InferResponseType<typeof $patch, 200>;
type Request = InferRequestType<typeof $patch>["json"];

export function useUpdateBookPrepStatus() {
  const queryClient = useQueryClient();
  return useMutation<Response, Error, Request>({
    mutationFn: async (formData) => {
      const res = await $patch({ json: formData });

      if (!res.ok) {
        throw new Error("Failed to update book preparation status");
      }

      const data = await res.json();
      toast.success(data.message);
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [...bookPrepKeys.all] });
    },
  });
}
