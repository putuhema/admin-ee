import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<typeof client.api.students.$post>["json"];
type ResponseType = InferResponseType<typeof client.api.students.$post>;

export const usePostStudents = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const res = await client.api.students.$post({ json: data });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["students"] });
    },
  });

  return mutation;
};
