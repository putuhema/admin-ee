import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

const $post = client["api"]["enrollement"]["$post"];
type Request = InferRequestType<typeof $post>["json"];
type Response = InferResponseType<typeof $post>;

export const usePostEnrollment = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<Response, Error, Request>({
    mutationFn: async (data) => {
      const res = await $post({ json: data });
      if (!res.ok) {
        throw new Error("Failed to post enrollment");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      toast.success("Enrollment has been posted");
    },
  });
  return mutation;
};
