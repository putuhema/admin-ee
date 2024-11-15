import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type MeetingResponse = InferResponseType<
  typeof client.api.meetings.$get,
  200
>;

export function useGetMeetings(date: Date) {
  const query = useQuery<MeetingResponse, Error>({
    queryKey: ["meetings"],
    queryFn: async () => {
      const res = await client.api.meetings.$get({
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
