import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get =
  client.api.meetings.programs[":programId"]["students"][":studentId"]["$get"];
export type MeetingData = InferResponseType<typeof $get, 200>;

export function useGetMeetingByProgramsStudents({
  programId,
  studentId,
}: {
  programId: number | undefined;
  studentId: number | undefined;
}) {
  return useQuery<MeetingData, Error>({
    queryKey: ["meetings", "programs", programId, "students", studentId],
    queryFn: async () => {
      const res = await $get({
        param: {
          programId: programId!.toString(),
          studentId: studentId!.toString(),
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
