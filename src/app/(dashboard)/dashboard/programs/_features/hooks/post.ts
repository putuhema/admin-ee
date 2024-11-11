import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const $post = client["api"]["programs"]["extra"]["$post"];
type Request = InferRequestType<typeof $post>["json"];
type Response = InferResponseType<typeof $post>;

export function usePostProgramExtra() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationFn: async (data) => {
      const res = await $post({ json: data });
      if (!res.ok) {
        throw new Error("Failed to add program extra");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program-extra"] });
      queryClient.invalidateQueries({ queryKey: ["program"] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Added program extra");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
