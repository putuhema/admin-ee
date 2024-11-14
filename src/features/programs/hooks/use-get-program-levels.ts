import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client["api"]["programs"]["levels"][":programId"]["$get"];
export type ResponseType = InferResponseType<typeof $get, 200>;

export async function getProgramLevels({ programId }: { programId: number }) {
  const res = await $get({ param: { programId: programId.toString() } });
  if (!res.ok) {
    throw new Error("Programs not found");
  }

  return res.json();
}

export function useGetProgramLevels({ programId }: { programId: number }) {
  const query = useQuery<ResponseType, Error>({
    queryKey: ["program-levels", programId],
    queryFn: () => getProgramLevels({ programId }),
  });

  return query;
}
