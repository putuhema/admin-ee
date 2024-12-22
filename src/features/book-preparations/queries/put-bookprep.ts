import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const $put = client.api["book-preparations"]["$put"];

type BookResponse = InferResponseType<typeof $put, 200>;
type BookRequest = InferRequestType<typeof $put>["json"];

export function useUpdateBookPreparation() {
  const queryClient = useQueryClient();
  return useMutation<BookResponse, Error, BookRequest>({
    mutationFn: async (formData) => {
      const res = await $put({ json: formData });
      if (!res.ok) {
        throw new Error("Failed to create book preparations");
      }

      toast.success("Book preparations updated successfully");
      const data = await res.json();
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["book-preparations"] });
    },
  });
}
