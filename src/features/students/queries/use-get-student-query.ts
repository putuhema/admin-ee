import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type StudentType = InferResponseType<typeof client.api.students.$get>;

export const getStudents = async (name?: string | undefined) => {
  const res = await client.api.students["q"]["$get"]({
    query: { name },
  });
  const data = await res.json();
  return data;
};

export const useGetStudentsWithQuery = (name?: string | undefined) => {
  const query = useQuery<StudentType>({
    queryKey: ["students", name],
    queryFn: async () => getStudents(name),
    enabled: Boolean(name && name.length > 0),
  });

  return query;
};
