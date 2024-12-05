import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get =
  client.api.meetings.programs[":programId"]["students"][":studentId"]["$get"];
export type MeetingData = InferResponseType<typeof $get, 200>;

type Params = {
  monthYear?:
    | {
        month: number;
        year: number;
      }
    | undefined;
  programId: number | undefined;
  studentId: number | undefined;
};

export function useGetMeetingByProgramsStudents({
  monthYear,
  programId,
  studentId,
}: Params) {
  return useQuery<MeetingData, Error>({
    queryKey: [
      "meetings",
      "programs",
      programId,
      "students",
      studentId,
      monthYear?.month,
      monthYear?.year,
    ],
    queryFn: async () => {
      const res = await $get({
        param: {
          programId: programId!.toString(),
          studentId: studentId!.toString(),
        },
        query: {
          month: ((monthYear?.month ?? new Date().getMonth()) + 1).toString(),
          year: monthYear?.year.toString(),
        },
      });
      if (!res.ok) {
        throw new Error("Failed to get Meetings");
      }
      const data = await res.json();

      return data;
    },
    enabled: !!programId && !!studentId,
    refetchOnWindowFocus: true,
  });
}
