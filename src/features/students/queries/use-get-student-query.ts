import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const getStudents = async (name?: string | undefined) => {
  const res = await client.api.students["q"]["$get"]({
    query: { name },
  });
  if (!res) {
    throw new Error("Failed to get Students");
  }

  const data = await res.json();
  return data;
};

export const useGetStudentsWithQuery = (name?: string | undefined) => {
  return useQuery({
    queryKey: ["students", name],
    queryFn: async () => getStudents(name),
    enabled: Boolean(name && name.length > 0),
  });
};
