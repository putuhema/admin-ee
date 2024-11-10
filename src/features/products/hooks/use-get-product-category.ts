import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client["api"]["products"]["category"]["$get"];
export type ProductType = InferResponseType<typeof $get>;

export const getProductCategory = async () => {
  const res = await $get();
  return await res.json();
};

export const useGetProductCategory = () => {
  const query = useQuery<ProductType, Error>({
    queryKey: ["products"],
    queryFn: getProductCategory,
  });

  return query;
};
