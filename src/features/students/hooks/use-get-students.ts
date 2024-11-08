import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const getStudents = async () => {
  const res = await client.api.students.$get();
  const data = await res.json();
  return data;
};

export const useGetSubjects = () => {
  const query = useQuery({
    queryKey: ["students"],
    queryFn: getStudents,
  });

  return query;
};
