import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const $delete = client.api["book-preparations"]["$delete"];

type BookResponse = InferResponseType<typeof $delete, 200>;
type BookRequest = InferRequestType<typeof $delete>["json"];

export function useDeleteBookPreparation() {
  const queryClient = useQueryClient();
  return useMutation<BookResponse, Error, BookRequest>({
    mutationFn: async (formData) => {
      const res = await $delete({ json: formData });
      if (!res.ok) {
        throw new Error("Failed to delete book preparations");
      }

      toast.success("Book preparations deleted successfully");
      const data = await res.json();
      return data;
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["book-preparations"] });
    },
  });
}
