import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client.api.meetings[":meetingId"]["$get"];
export type MeetingResponse = InferResponseType<typeof $get, 200>;

export function useGetMeeting(meetingId: number) {
  const query = useQuery<MeetingResponse, Error>({
    queryKey: ["meeting", meetingId],
    queryFn: async () => {
      const res = await $get({
        param: {
          meetingId: meetingId.toString(),
        },
      });
      if (!res.ok) {
        throw new Error("Failed to get Meetings");
      }

      return await res.json();
    },
    enabled: !!meetingId,
  });

  return query;
}
