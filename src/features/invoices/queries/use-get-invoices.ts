import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export function useGetInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const res = await client.api.invoices.$get();
      if (!res.ok) {
        throw new Error("Failed to get invoices");
      }

      const data = await res.json();
      return data;
    },
  });
}
