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

export async function getProgram(programId: number) {
  const res = await client["api"]["programs"][":programId"]["$get"]({
    param: { programId: programId.toString() },
  });
  if (!res.ok) {
    throw new Error("Program not found");
  }
  return res.json();
}

export function useGetProgram(programId: number) {
  const query = useQuery({
    queryKey: ["program", programId],
    queryFn: async () => getProgram(programId),
    enabled: !!programId,
  });

  return query;
}
