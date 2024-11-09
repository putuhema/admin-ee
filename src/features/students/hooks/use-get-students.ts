import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type StudentType = InferResponseType<typeof client.api.students.$get>;

export const getStudents = async () => {
  const res = await client.api.students.$get();
  const data = await res.json();
  return data;
};

export const useGetStudents = () => {
  const query = useQuery<StudentType>({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  return query;
};
