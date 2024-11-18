import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client.api.meetings.date[":date"]["$get"];
export type MeetingDateResponse = InferResponseType<typeof $get, 200>;

export function useGetMeetingByDate(date: Date | undefined) {
  const query = useQuery<MeetingDateResponse, Error>({
    queryKey: ["meeting/date", date],
    queryFn: async () => {
      const res = await $get({
        param: {
          date: new Date(date!).toISOString(),
        },
      });
      if (!res.ok) {
        throw new Error("Failed to get Meetings");
      }

      return await res.json();
    },
    enabled: !!date,
  });

  return query;
}
