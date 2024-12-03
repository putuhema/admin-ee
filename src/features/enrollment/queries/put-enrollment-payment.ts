import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

const $put = client["api"]["payments"]["enrollment"]["$put"];
type Request = InferRequestType<typeof $put>["json"];
type Response = InferResponseType<typeof $put, 200>;

export const useEnrollmentPayment = () => {
  const queryClient = useQueryClient();
  return useMutation<Response, Error, Request>({
    mutationFn: async (data) => {
      const res = await $put({ json: data });
      if (!res.ok) {
        throw new Error("Failed to post enrollment");
      }

      const resData = await res.json();
      return resData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
