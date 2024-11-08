import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const getSubjects = async () => {
  const res = await client.api.subjects.$get();
  const data = await res.json();
  return data;
};

export const useGetSubjects = () => {
  const query = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });

  return query;
};
