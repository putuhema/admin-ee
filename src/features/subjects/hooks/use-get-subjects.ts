import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export const QUERY_KEY = ["subjects"];
export type SubjectType = InferResponseType<typeof client.api.subjects.$get>;

export const getSubjects = async () => {
  const res = await client.api.subjects.$get();
  const data = await res.json();
  return data;
};

export const useGetSubjects = () => {
  const query = useQuery<SubjectType>({
    queryKey: QUERY_KEY,
    queryFn: getSubjects,
  });

  return query;
};
