import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type EnrollementType = InferResponseType<
  typeof client.api.enrollement.$get
>;

export const getEnrollment = async () => {
  const res = await client.api.enrollement.$get();
  const data = await res.json();
  return data;
};

export const useGetEnrollement = () => {
  const query = useQuery<EnrollementType>({
    queryKey: ["enrollements"],
    queryFn: getEnrollment,
  });

  return query;
};
