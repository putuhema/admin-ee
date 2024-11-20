import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client.api.meetings.schedule.$get;
export type MeetingResponse = InferResponseType<typeof $get, 200>;

export function useGetSchedule(date: Date) {
  const query = useQuery<MeetingResponse, Error>({
    queryKey: ["schedule"],
    queryFn: async () => {
      const res = await $get({
        query: {
          date: new Date(date).toISOString(),
        },
      });
      if (!res.ok) {
        throw new Error("Failed to get Meetings");
      }

      return await res.json();
    },
  });

  return query;
}
