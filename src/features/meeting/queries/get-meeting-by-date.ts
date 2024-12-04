import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { InferResponseType } from "hono";

const $get = client.api.meetings.date[":date"]["$get"];
export type MeetingDateData = InferResponseType<typeof $get, 200>;

export function useGetMeetingByDate(date: Date | undefined) {
  const query = useQuery<MeetingDateData, Error>({
    queryKey: ["meetings", format(date!, "yyyy-MM-dd")],
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
    refetchOnWindowFocus: true,
  });

  return query;
}
