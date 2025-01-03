import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { programQueryOptions } from "@/features/programs/hooks/get";
import Table from "@/features/programs/data-table/table";

export default async function SubjectPage() {
  const queryClient = new QueryClient();

  queryClient.prefetchQuery(programQueryOptions);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main>
        <Table />
      </main>
    </HydrationBoundary>
  );
}
