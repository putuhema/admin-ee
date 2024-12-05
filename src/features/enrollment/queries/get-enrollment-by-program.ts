import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

const $get = client.api.enrollments.programs[":programId"]["$get"];

export function useGetEnrollmentProgram(programId: number) {
  return useQuery({
    queryKey: ["enrollments", "program", programId],
    queryFn: async () => {
      const res = await $get({
        param: {
          programId: programId.toString(),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to get enrollments");
      }

      const data = await res.json();
      return data;
    },
  });
}
