import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

export type EnrollementData = InferResponseType<
  typeof client.api.enrollments.$get
>;

export const getEnrollment = async () => {
  const res = await client.api.enrollments.$get();
  const data = await res.json();
  return data;
};

export const useGetEnrollement = () => {
  const query = useQuery<EnrollementData>({
    queryKey: ["enrollments"],
    queryFn: getEnrollment,
  });

  return query;
};
