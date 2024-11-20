import { client } from "@/lib/rpc";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type StudentType = InferResponseType<
  typeof client.api.students.$get,
  200
>;

export const getStudents = async () => {
  const res = await client.api.students.$get();
  if (!res.ok) {
    throw new Error("Failed to fetch students");
  }
  const data = await res.json();
  return data;
};

export const studentQueryOptions: UseQueryOptions<StudentType> = {
  queryKey: ["students"],
  queryFn: getStudents,
};

export const useGetStudents = () => {
  const query = useQuery<StudentType>(studentQueryOptions);
  return query;
};
