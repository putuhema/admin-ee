import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { bookPrepKeys } from "./keys";

const $get = client.api["book-preparations"][":id"]["$get"];
export type BookPrepData = InferResponseType<typeof $get, 200>;

export const useGetBookPrep = (id: number) => {
  return useQuery<BookPrepData, Error>({
    queryKey: bookPrepKeys.detail(id),
    queryFn: async () => {
      const response = await $get({
        param: { id: id.toString() },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch book preps");
      }

      const data = await response.json();
      return data;
    },
  });
};
