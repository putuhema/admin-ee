import { client } from "@/lib/rpc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client["api"]["students"][":studentId"]["$get"];
export type StudentType = InferResponseType<typeof $get>;

export const getStudent = async (studentId: string) => {
  const res = await $get({
    param: {
      studentId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch student");
  }

  return await res.json();
};

export const useGetStudent = (studentId: string) => {
  const query = useQuery({
    queryKey: ["student", studentId],
    queryFn: async () => getStudent(studentId),
    enabled: !!studentId,
    refetchOnWindowFocus: false,
  });

  return query;
};

export const useGetStudentPrefetch = (studentId: string) => {
  const queryClient = useQueryClient();

  const prefetch = async () => {
    queryClient.prefetchQuery({
      queryKey: ["student", studentId],
      queryFn: async () => getStudent(studentId),
      staleTime: 1000 * 60 * 5,
    });
  };

  return prefetch;
};
