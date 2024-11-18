import { client } from "@/lib/rpc";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client.api.teachers.$get;
export type TeacherResponse = InferResponseType<typeof $get, 200>;

export const getTeachersQueryOptions: UseQueryOptions<TeacherResponse, Error> =
  {
    queryKey: ["teachers"],
    queryFn: async () => {
      const res = await $get();
      if (!res.ok) {
        throw new Error("Failed to get teachers");
      }
      return await res.json();
    },
  };

export function useGetTeachers() {
  return useQuery<TeacherResponse, Error>(getTeachersQueryOptions);
}
