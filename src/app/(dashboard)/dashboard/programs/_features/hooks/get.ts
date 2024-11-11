import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client["api"]["programs"]["$get"];
export type ResponseType = InferResponseType<typeof $get>;

export async function getPrograms() {
  const res = await $get();
  return res.json();
}

export function useGetPrograms() {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["programs"],
    queryFn: getPrograms,
  });

  return query;
}
