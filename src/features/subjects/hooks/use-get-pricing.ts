import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export const QUERY_KEY = ["subjects-pricing"];
export type SubjectPricingType = InferResponseType<
  typeof client.api.subjects.pricing.$get
>;

export const getSubjectPricing = async () => {
  const res = await client.api.subjects.pricing.$get();
  const data = await res.json();
  return data;
};

export const useGetSubjectPricing = () => {
  const query = useQuery<SubjectPricingType>({
    queryKey: QUERY_KEY,
    queryFn: getSubjectPricing,
  });

  return query;
};
