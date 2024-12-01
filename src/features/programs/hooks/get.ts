import { client } from "@/lib/rpc";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { InferResponseType } from "hono";

const $get = client["api"]["programs"]["$get"];
export type ResponseType = InferResponseType<typeof $get, 200>;

export async function getPrograms() {
  const res = await $get();
  if (!res.ok) {
    throw new Error("Programs not found");
  }

  return res.json();
}
export const programQueryOptions: UseQueryOptions<ResponseType> = {
  queryKey: ["programs"],
  queryFn: getPrograms,
};

export function useGetPrograms() {
  return useQuery<ResponseType, Error>(programQueryOptions);
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

export function useGetProgramExtra(programId: number, enabled: boolean) {
  const query = useQuery({
    queryKey: ["program-extra", programId],
    queryFn: async () => {
      const res = await client["api"]["programs"]["extra"][":programId"][
        "$get"
      ]({
        param: { programId: programId.toString() },
      });
      if (!res.ok) {
        throw new Error("Program extra not found");
      }
      return res.json();
    },
    enabled: !!programId && enabled,
  });

  return query;
}
