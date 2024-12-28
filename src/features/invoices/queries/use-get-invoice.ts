import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export function useGetInvoice(id: number) {
  return useQuery({
    queryKey: ["invoices", id],
    queryFn: async () => {
      const res = await client.api.invoices[":studentId"]["$get"]({
        param: {
          studentId: id.toString(),
        },
      });
      if (!res.ok) {
        throw new Error("Failed to get invoices");
      }

      const data = await res.json();
      return data;
    },
    enabled: !!id,
  });
}
