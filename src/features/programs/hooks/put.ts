import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const $put = client["api"]["programs"]["$put"];
type Request = InferRequestType<typeof $put>["json"];
type Response = InferResponseType<typeof $put>;

export function usePutProgram() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Response, Error, Request>({
    mutationFn: async (data) => {
      const res = await $put({ json: data });
      if (!res.ok) {
        throw new Error("Failed to update program");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["program"] });
      queryClient.invalidateQueries({ queryKey: ["programs"] });
      toast.success("Program updated");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return mutation;
}
