import { client } from "@/lib/rpc";
import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client["api"]["students"][":studentId"]["$get"];
export type StudentResponse = InferResponseType<typeof $get, 200>;

const getStudentQueryOptions = (
  studentId: number,
): UseQueryOptions<StudentResponse, Error> => ({
  queryKey: ["student", studentId],
  queryFn: async () => {
    const res = await $get({
      param: {
        studentId: studentId.toString(),
      },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch student");
    }

    return await res.json();
  },
  enabled: !!studentId,
});

export const useGetStudent = (studentId: number) => {
  return useQuery(getStudentQueryOptions(studentId));
};

export const useGetStudentPrefetch = (studentId: number) => {
  const queryClient = useQueryClient();

  return async () => {
    queryClient.prefetchQuery({
      ...getStudentQueryOptions(studentId),
      staleTime: 1000 * 60 * 5,
    });
  };
};
