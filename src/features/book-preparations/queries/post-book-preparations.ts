import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

const $post = client.api["book-preparations"]["$post"];

type BookResponse = InferResponseType<typeof $post, 200>;
type BookRequest = InferRequestType<typeof $post>["json"];

export function useCreateBookPreparations() {
  const queryClient = useQueryClient();
  return useMutation<BookResponse, Error, BookRequest>({
    mutationFn: async (formData) => {
      const res = await $post({ json: formData });
      if (!res) {
        throw new Error("Failed to create book preparations");
      }

      const data = await res.json();
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["book-preparations"] });
    },
  });
}
