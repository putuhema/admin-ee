import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client.api.enrollments[":enrollmentId"]["$get"];
export type EnrollementData = InferResponseType<typeof $get, 200>;

export const getEnrollment = async (enrollmentId: string) => {
  const res = await $get({
    param: {
      enrollmentId,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to get enrollemnt details");
  }
  const data = await res.json();
  return data;
};

export const useGetEnrollementDetails = (enrollmentId: string) => {
  return useQuery<EnrollementData>({
    queryKey: ["enrollments", enrollmentId],
    queryFn: async () => getEnrollment(enrollmentId),
  });
};
