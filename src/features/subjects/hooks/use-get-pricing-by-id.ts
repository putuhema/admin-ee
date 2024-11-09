import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export const QUERY_KEY = ["subjects-pricing"];
export type SubjectPricingType = InferResponseType<
  (typeof client.api.subjects.pricing)[":subjectId"]["$get"]
>;

export const getSubjectPricingById = async (subjectId: string) => {
  const res = await client.api.subjects.pricing[":subjectId"]["$get"]({
    param: {
      subjectId,
    },
  });
  const data = await res.json();
  return data;
};

export const useGetSubjectPricingById = (subjectId: string) => {
  const query = useQuery<SubjectPricingType>({
    queryKey: [...QUERY_KEY, subjectId],
    queryFn: async () => getSubjectPricingById(subjectId),
    enabled: !!subjectId && subjectId !== "0",
  });

  return query;
};
