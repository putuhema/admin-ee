import { client } from "@/lib/rpc";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";

const $post = client.api.meetings.session.$post;
type ResponseType = InferResponseType<typeof $post>;
type RequestType = InferRequestType<typeof $post>["json"];

export const useCreateMeetingSession = () => {
  const queryClient = useQueryClient();
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (data) => {
      const response = await $post({ json: data });
      if (!response.ok) {
        throw new Error("Failed to create meeting session");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Meeting session created successfully");
      queryClient.invalidateQueries({ queryKey: ["meeting/date"] });
    },
  });
};
