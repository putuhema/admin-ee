import { client } from "@/lib/rpc";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client.api.packages.$get;

type Response = InferResponseType<typeof $get>;

export const packageOptions: UseQueryOptions<Response> = {
  queryKey: ["packages"],
  queryFn: async () => {
    const res = await $get();
    return res.json();
  },
};

export function useGetPackages() {
  const query = useQuery<Response, Error>(packageOptions);
  return query;
}
