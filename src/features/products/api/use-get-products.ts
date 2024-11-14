import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

const $get = client.api.products.$get;
type ResponseType = InferResponseType<typeof $get>;

export const productsQueryOptions: UseQueryOptions<ResponseType> = {
  queryKey: ["products"],
  queryFn: async () => {
    const res = await $get();
    return res.json();
  },
};

export function useGetProducts() {
  const query = useQuery<ResponseType, Error>(productsQueryOptions);
  return query;
}
