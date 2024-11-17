import { client } from "@/lib/rpc";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client.api.meetings.$get;
export type MeetingsResponse = InferResponseType<typeof $get, 200>;

export const meetingQueryOptions: UseQueryOptions<MeetingsResponse> = {
  queryKey: ["meetings"],
  queryFn: async () => {
    const res = await $get();

    if (!res.ok) {
      throw new Error("Failed to get Meetings");
    }

    return await res.json();
  },
};

export function useGetMeetings() {
  const query = useQuery<MeetingsResponse, Error>(meetingQueryOptions);
  return query;
}
